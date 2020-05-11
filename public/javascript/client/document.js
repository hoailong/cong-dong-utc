let continueLoad = true;
const limit = 10;
let start = limit;
let order = 'created_time desc';

$(document).ready(function(){
    $(document).on('change', '.faculty_search, .type_search', doc_filter);

    $(document).on('change', '.order_by', function(){
        order = $(this).val();
        start = 0;
        $('.list-doc-container').empty();
        loadMore();
    });

    $('#collapseFilter').on('show.bs.collapse', function () {
        $('.open-filter i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    });
    $('#collapseFilter').on('hidden.bs.collapse', function () {
        $('.open-filter i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });

    $(window).scroll(function() {
        if(continueLoad && ($(window).scrollTop() == $(document).height() - $(window).height()
            ||  $(window).scrollTop() == $(document).height() - $(window).height() - 18)){
            loadMore();
        } else {
            $('.load-data').hide();
        }
    });
});

function doc_filter(){
    let id_faculty;
    let id_type;
    if($('.doc-control-mobile').is(":visible")){
        id_faculty = $('#faculty_search_sm').val();
        id_type = $('#type_search_sm').val();
    } else {
        id_faculty = $('#faculty_search_lg').val();
        id_type = $('#type_search_lg').val();
    }
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
    if($('.vote-item:not(.d-none)').length < limit && continueLoad) loadMore();
}

function loadMore(){
    $('.load-data').show();
    continueLoad = false;
    fetch(`/docs/d/${g_subject.id_subject}/`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ start, limit, order})
    })
        .then(res => res.json())
        .then(data => {
            let newData = ``;
            data.forEach(doc =>
                newData+= `<div class="vote-item">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <div class="vote-actions">
                                                <i class="fa fa-chevron-up"> </i>
                                                <div class="text-danger">${ doc.count_likes }</div>
                                                <i class="fa fa-chevron-down"> </i>
                                            </div>
                                            <a href="/docs/d/${ doc.id_doc }" class="vote-title">${ doc.title || 'Không tiêu đề'} ${ doc.type==="DT" ? " (" + doc.year_name + ")" : "" }</a>
                                            <div class="vote-info" data-faculty="${ doc.id_faculty }" data-type="${ doc.type }">
                                                <i class="fa fa-list-alt"></i> ${ doc.faculty_name }
                                                <i class="fa fa-calendar"></i> ${moment(doc.created_time).format('DD/MM/YYYY HH:mm:ss') }
                                                <i class="fa fa-user"></i> <a href="#">
                                                    ${ doc.privacy == 'public' ? doc.user_name : 'Người tốt bụng'}
                                                </a>
                                                <br/>
                                                <i class="fa fa-heart-o"></i> ${ doc.count_likes }
                                                <i class="fa fa-comment-o"></i> ${ doc.count_comments }
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
            $(newData).appendTo('.list-doc-container').hide().fadeIn(2000);
            $(window).scrollTop($(window).scrollTop()-5);
            $('.load-data').hide();
            if(data.length === limit) continueLoad = true;
            doc_filter();
            start = start + limit;
        })
        .catch(err => console.log(err));
}