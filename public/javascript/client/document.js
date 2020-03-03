let continueLoad = true;
let from = 0;
const count = 10;

$(document).ready(function(){
    $(document).on('change', '#faculty_search, #type_search', doc_filter);

    $(window).scroll(function() {
        if(continueLoad && ($(window).scrollTop() == $(document).height() - $(window).height() ||  $(window).scrollTop() == $(document).height() - $(window).height() - 18)){
            $('.load-data').show();
            continueLoad = false;
            from = from + count;
            fetch(`/docs/d/${g_subject.id_subject}/${from}/${count}`)
                .then(res => res.json())
                .then(data => {
                    let newData = ``;
                    data.forEach(doc => newData+= `<div class="vote-item">
                                                        <div class="row">
                                                            <div class="col-md-10">
                                                                <div class="vote-actions">
                                                                    <i class="fa fa-chevron-up"> </i>
                                                                    <div class="text-danger">${ doc.view }</div>
                                                                    <i class="fa fa-chevron-down"> </i>
                                                                </div>
                                                                <a href="/docs/d/${ doc.id_doc }" class="vote-title">${ doc.title || 'Không tiêu đề'} ${ doc.type==="DT" ? " (" + doc.year_name + ")" : "" }</a>
                                                                <div class="vote-info" data-faculty="${ doc.id_faculty }" data-type="${ doc.type }">
                                                                    <i class="fa fa-list-alt"></i> ${ doc.faculty_name }
                                                                    <i class="fa fa-calendar"></i> ${moment(doc.created_time).format('DD/MM/YYYY HH:mm:ss') }
                                                                    <i class="fa fa-user"></i> <a href="#">
                                                                        ${ doc.privacy == 'public' ? doc.user_name : 'Người tốt bụng'}
                                                                    </a>
                                                                    <i class="fa fa-eye"></i> ${ doc.view }
                                                                </div>
                                                            </div>
                                                            <div class="col-md-2 ">
                                                                <div class="vote-icon">
                                                                    <i class="fa fa-paper-plane"> </i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>`);
                    $(newData).appendTo('.list-doc').hide().fadeIn(1500);
                    $(window).scrollTop($(window).scrollTop()-5);
                    $('.load-data').hide();
                    if(data.length === count) continueLoad = true;
                    doc_filter();
                })
                .catch(err => console.log(err));
        } else {
            $('.load-data').hide();
        }
    });
});

function doc_filter(){
    const id_faculty = $('#faculty_search').val();
    const id_type = $('#type_search').val();
    $('.vote-item .vote-info').each((i, v) => {
        if (($(v).attr('data-faculty') === id_faculty || id_faculty === "0")
            && ($(v).attr('data-type') === id_type || id_type === "0")) {
            $(v).closest('.vote-item ').removeClass('d-none');
        } else {
            $(v).closest('.vote-item ').addClass('d-none');
        }
    });
    if($('.vote-item:not(.d-none)').length === 0) {
        $('#show-none').removeClass('d-none');
    } else {
        $('#show-none').addClass('d-none');
    }
}