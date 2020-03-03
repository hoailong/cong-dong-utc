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

    // $(document).on('click', '.verify', async function(){
    //     const id_document = $(this).closest('tr').attr('id');
    //     const url = `/admin/document/verify/${id_document}`;
    //     console.log(id_document);
    //     console.log(url);
    //     // fetch(url)
    //     // .then(res => {
    //     //     if(res.status === 200) {
    //     //         alert('done');
    //     //         location.reload();
    //     //     } else {
    //     //         toastr.error('Lỗi!');
    //     //     }
    //     // })
    //     // .catch(err => console.log(err));
    // });

    $(document).on('click', '.view', async function(){
        const id_document = $(this).attr('data-id');
        const url = `/admin/document/view/${id_document}`;
        let dataAppend = ``;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.forEach((file, index) => {
                dataAppend+= ` <li class="list-group-item px-0">
                                <div class="row align-items-center">
                                    <div class="col ml--2">
                                        <h4 class="mb-1 name">
                                            <span class="text-success">[${index + 1}].</span>
                                            <a href="/upload/${['jpg', 'png', 'svg', 'gif'].includes(file.filename.substring(file.filename.lastIndexOf('.')+1)) ? 'photo' : 'file'}/${file.filename}" target="_blank">${file.filename}</a>
                                        </h4>
                                    </div>
                                </div> <!-- / .row -->
                            </li>`;
                $('.list-file').empty().append(dataAppend);
                $('#doc_view_modal').modal('show');
            })
        })
        .catch(err => console.log(err));
    });


    $(document).on('click', '.edit', async function(){
       alert('Đang update');
    });

});