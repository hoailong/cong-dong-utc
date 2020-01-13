$(document).ready(function(){
    let table = $('#document-table').DataTable({
        // lengthChange: false,
    });

    $('#document-table_filter').append(`
        &nbsp;<div class="dt-buttons btn-group">
            <button class="btn btn-sm btn-info btn-filter"><span>Tất cả</span></button>
            <button class="btn btn-sm btn-warning btn-filter"><span>Chờ duyệt</span></button>
            <button class="btn btn-sm btn-sm btn-success btn-filter"><span>Đã duyệt</span></button>
            <button class="btn btn-sm btn-danger btn-filter"><span>Chờ xóa</span></button>
            <button class="btn btn-sm btn-secondary btn-filter"><span>Ẩn</span></button>
        </div>`
    );

    $(document).on('click', '.btn-filter', function(){
        const status = $(this).text() === 'Tất cả' ? '' : $(this).text();
        table.columns(6)
            .search(status)
            .draw();
    });

    $(document).on('click', '.verify', async function(){
        const id_document = $(this).closest('tr').attr('id');
        const url = `/admin/document/verify/${id_document}`;
        fetch(url)
        .then(res => {
            if(res.status === 200) {
                location.reload();
            } else {
                toastr.error('Lỗi!');
            }
        })
        .catch(err => console.log(err));
    });


});