$(document).ready(function(){
    let table = $('#subjectTable').DataTable({
        // lengthChange: false,
    });
    $(document).on('click', '.edit', function(){
       $('#subject_modal') .modal('show');
       const id_subject = $(this).closest('tr').attr('id');
       const subject_code = $(this).closest('tr').find('.subject_code').text();
       const subject_name = $(this).closest('tr').find('.subject_name').text();
       const subject_slug = $(this).closest('tr').find('.subject_slug').text();
       $('#id_subject').val(id_subject);
       $('#subject_code').val(subject_code);
       $('#subject_name').val(subject_name);
       $('#subject_slug').val(subject_slug);
    });
    $(document).on('click', '.delete', function(){
        $('#id_delete').val($(this).closest('tr').attr('id'));
        $('#delete_modal').modal('show');
    });
    $(document).on('keyup keypress blur change', '#subject_name', function () {
        let name = $(this).val();
        $('#subject_slug').val(getSlug(name));
    });

    $('#btnSave').click(async function(){
        const id_subject = $('#id_subject').val();
        const subject_code = $('#subject_code').val();
        const subject_name = $('#subject_name').val();
        const subject_slug = $('#subject_slug').val();

        const data = { id_subject, subject_code, subject_name, subject_slug };
        fetch('/admin/subject/save', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                $('#subject_modal').modal('hide');
                clearForm();
                if(data.status === 200) {
                    const index = data.created ? $('#subjectTable >tbody >tr').length + 1
                                : $('#subjectTable').find(`#${id_subject}`).find("td:first").text();
                    const subject = data.data;
                    const tr = `<tr id="${subject.id_subject}">
                                    <td>${index}</td>
                                    <td class="subject_code">${subject.subject_code}</td>
                                    <td class="subject_name">${subject.subject_name}</td>
                                    <td class="subject_slug d-none d-md-block">${subject.subject_name}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary edit"><i class="fa fa-pencil"></i></button> |
                                        <button class="btn btn-sm btn-outline-danger delete"><i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>`;
                    if(data.created) {
                        $('#subjectTable > tbody').append(tr);
                        toastr.success('Thêm môn học mới thành công!');
                    } else {
                        $('#subjectTable').find(`#${id_subject}`).replaceWith(tr);
                        toastr.success('Cập nhật môn học thành công!');
                    }
                } else {
                    toastr.error('Cập nhật môn học không thành công!')
                }
            })
            .catch(error => console.log(error));
    });

    $('#btnDelete').click(async function(){
        const id_subject = $('#id_delete').val();
        fetch('/admin/subject/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_subject })
        })
            .then(res => res.json())
            .then(data => {
                $('#delete_modal').modal('hide');
                if(data.status === 200) {
                    $('#subjectTable > tbody').find(`#${id_subject}`).remove();
                    toastr.success('Xóa môn học thành công!');
                } else {
                    toastr.error('Xoá môn học không thành công!')
                }
            })
            .catch(error => console.log(error));

    });

    $('#createsubject').click(clearForm);
});

function clearForm() {
    $('#id_subject').val('');
    $('#subject_code').val('');
    $('#subject_name').val('');
    $('#subject_slug').val('');
}