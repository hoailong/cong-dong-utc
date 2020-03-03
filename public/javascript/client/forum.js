$(document).ready(function() {
    //pogination
    // const {page, totalPage, limit} = g_pagination;
    // console.log(page, totalPage, limit);
    // showPagination(page, totalPage);
    $('.post-filter, .btn-cancel-post-filter').click(function(){
        $('.post-filter-form').toggleClass('d-none');
    });

    $('.btn-submit-post-filter').click(function(){
        const direction = $('#direction').val();
        const order = $('#order').val();
        let query = order && order !== 'created_time' ? `&order=${order}` : '';
        query += direction && direction !== 'desc' ? `&direction=${direction}` : '';
        location.search = query;
        location.href;
    });


});

function showPagination(page, totalPage){
    const long_mode = totalPage > 5;
    if(totalPage > 1) {
        let pages = ``;
        for(let j = page-2; j <= page+2; j++) {
            let i = page - 2 <= 0 ? j + (3-page) : (page + 2 > totalPage ? j-(page - totalPage + 2) : j );
            if(i <= totalPage && i > 0) {
                pages+= `<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="/forum/${g_topic.topic_code}.${g_topic.id_topic}${i !== 1 ? '?page=' + i : ''}">${i}</a></li>`;
            }
        }
        if(long_mode){
            $('.post-pagination ul').empty().append(`  
                ${page > 3 ? `<li class="page-item"><a class="page-link" href="/forum/${g_topic.topic_code}.${g_topic.id_topic}"><i class="fa fa-backward"></i></a></li>` : ''}
                ${pages}
                ${page < totalPage-2 ? `<li class="page-item"><a class="page-link" href="/forum/${g_topic.topic_code}.${g_topic.id_topic}?page=${totalPage}"><i class="fa fa-forward"></i></a></li>` : ''}
            `);
        } else {
            $('.post-pagination ul').empty().append(pages);
        }
    }
}