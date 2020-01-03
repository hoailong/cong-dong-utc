$(document).ready(function(){
    let table = $('#facultyTable').DataTable({
        // lengthChange: false,
    });
    $(document).on('click', '.edit', function(){
       $('#faculty_modal') .modal('show');
       const id_faculty = $(this).closest('tr').attr('id');
       const faculty_code = $(this).closest('tr').find('.faculty_code').text();
       const faculty_name = $(this).closest('tr').find('.faculty_name').text();
       $('#id_faculty').val(id_faculty);
       $('#faculty_code').val(faculty_code);
       $('#faculty_name').val(faculty_name);
    });

    $(document).on('click', '.delete', function(){
        $('#id_delete').val($(this).closest('tr').attr('id'));
        $('#delete_modal').modal('show');
    });

    $('#btnSave').click(async function(){
        const id_faculty = $('#id_faculty').val();
        const faculty_code = $('#faculty_code').val();
        const faculty_name = $('#faculty_name').val();

        const data = { id_faculty, faculty_code, faculty_name };
        fetch('/admin/faculty/save', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                $('#faculty_modal').modal('hide');
                clearForm();
                if(data.status === 200) {
                    const index = data.created ? $('#facultyTable >tbody >tr').length + 1
                                : $('#facultyTable').find(`#${id_faculty}`).find("td:first").text();
                    const faculty = data.data;
                    const tr = `<tr id="${faculty.id_faculty}">
                                    <td>${index}</td>
                                    <td class="faculty_code">${faculty.faculty_code}</td>
                                    <td class="faculty_name">${faculty.faculty_name}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary edit"><i class="fa fa-pencil"></i></button> |
                                        <button class="btn btn-sm btn-outline-danger delete"><i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>`;
                    if(data.created) {
                        $('#facultyTable > tbody').append(tr);
                        toastr.success('Thêm khoa mới thành công!');
                    } else {
                        $('#facultyTable').find(`#${id_faculty}`).replaceWith(tr);
                        toastr.success('Cập nhật khoa thành công!');
                    }
                } else {
                    toastr.error('Cập nhật khoa không thành công!')
                }
            })
            .catch(error => console.log(error));
    });

    $('#btnDelete').click(async function(){
        const id_faculty = $('#id_delete').val();
        fetch('/admin/faculty/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_faculty })
        })
            .then(res => res.json())
            .then(data => {
                $('#delete_modal').modal('hide');
                if(data.status === 200) {
                    $('#facultyTable > tbody').find(`#${id_faculty}`).remove();
                    toastr.success('Xóa khoa thành công!');
                } else {
                    toastr.error('Xoá khoa không thành công!')
                }
            })
            .catch(error => console.log(error));

    });

    $('#createFaculty').click(clearForm);
});

function clearForm() {
    $('#id_faculty').val('');
    $('#faculty_code').val('');
    $('#faculty_name').val('');
}