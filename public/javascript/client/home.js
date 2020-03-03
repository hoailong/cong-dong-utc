let continueLoad = false;
let from = 0;
const count = 20;

$(document).ready(function(){
    $('#subjectSearch').on('keyup change', function(){
        let key = $(this).val().toUpperCase();
        $('.folder .subject-name').each((i, v) => {
            if ($(v).text().toUpperCase().includes(key)) {
                $(v).closest('.folder').removeClass('d-none');
            } else {
                $(v).closest('.folder').addClass('d-none');
            }
        });
        if($('.folder:not(.d-none)').length === 0) {
            $('.list-subject h3').removeClass('d-none');
        } else {
            $('.list-subject h3').addClass('d-none');
        }
    });


    $(window).scroll(function() {
        if(continueLoad && $(window).scrollTop() == $(document).height() - $(window).height()) {
            $('.load-data').show();
            continueLoad = false;
            from = from + count;
            // let subjectSearch = $('#subjectSearch').val();
            fetch(`/docs/s/${from}/${count}`)
                .then(res => res.json())
                .then(data => {
                    let newData = ``;
                    data.forEach(subject => newData+= `<div class="folder">
                                                <div class="folder-infor">
                                                    <a href="/docs/s/${ subject.id_subject }" id="${ subject.id_subject }">
                                                        <img src="/img/icon-folder.svg" alt="">
                                                        <span class="detail font-weight-bold"><i class="fa fa-file-text"></i> ${ subject.doc_count }</span>
                                                        <h6 class="subject-name">${ subject.subject_name }</h6>
                                                    </a>
                                                </div>
                                            </div>`);
                    $(newData).appendTo('.list-subject').hide().fadeIn(1500);
                    $(window).scrollTop($(window).scrollTop()-5);
                    $('.load-data').hide();
                    if(data.length === count) continueLoad = true;
                })
                .catch(err => console.log(err));
        } else {
            $('.load-data').hide();
        }
    });
});