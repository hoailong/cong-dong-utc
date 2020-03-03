$(document).ready(function(){
    let table = $('#userTable').DataTable({
        // lengthChange: false,
    });
    $(document).on('click', '.edit', function(){
       $('#user_modal') .modal('show');
       const id_user = $(this).closest('tr').attr('id');
       const user_name = $(this).closest('tr').find('.user_name').text();
       const email = $(this).closest('tr').find('.email').text();
       const role =  $(this).closest('tr').find('.role').text();
       $('#id_user').val(id_user);
       $('#user_name').val(user_name);
       $('#email').val(email);
       $('#role').val(role);
    });

    $(document).on('click', '.delete', function(){
        $('#id_delete').val($(this).closest('tr').attr('id'));
        $('#delete_modal').modal('show');
    });

    $('#btnSave').click(async function(){
        const id_user = $('#id_user').val();
        const user_name = $('#user_name').val();
        const email = $('#email').val();
        const role = $('#role').val();

        const data = { id_user, user_name, email , role };
        fetch('/admin/user/save', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                $('#user_modal').modal('hide');
                clearForm();
                if(data.status === 200) {
                    const index = data.created ? $('#userTable >tbody >tr').length + 1
                                : $('#userTable').find(`#${id_user}`).find("td:first").text();
                    const user = data.data;
                    const tr = `<tr id="${ user.id_user}">
                                    <td>${ index+1}</td>
                                    <td class="user_name">${ user.user_name}</td></td>
                                    <td class="email">${ user.email}</td></td>
                                    <td class="picture"><img src="/img/profile/${ user.picture}" class="rounded-circle" alt="${ user.user_name}" width="40px"></td>
                                    <td class="role">${ user.role}</td></td>
                                    <td class="joined_time">${ moment(user.joined_time).format('DD/MM/YYYY HH:mm:ss')}</td></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary edit"><i class="fa fa-pencil"></i></button> |
                                        <button class="btn btn-sm btn-outline-danger delete"><i class="fa fa-trash"></i></button>
                                    </td>
                                </tr>`;
                    if(data.created) {
                        $('#userTable > tbody').append(tr);
                        toastr.success('Thêm tài khoản mới thành công!');
                    } else {
                        $('#userTable').find(`#${id_user}`).replaceWith(tr);
                        toastr.success('Cập nhật tài khoản thành công!');
                    }
                } else {
                    toastr.error('Cập nhật tài khoản không thành công!')
                }
            })
            .catch(error => console.log(error));
    });

    $('#btnDelete').click(async function(){
        const id_user = $('#id_delete').val();
        fetch('/admin/user/delete', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_user })
        })
            .then(res => res.json())
            .then(data => {
                $('#delete_modal').modal('hide');
                if(data.status === 200) {
                    $('#userTable > tbody').find(`#${id_user}`).remove();
                    toastr.success('Xóa tài khoản thành công!');
                } else {
                    toastr.error('Xoá tài khoản không thành công!')
                }
            })
            .catch(error => console.log(error));

    });

    $('#createFaculty').click(clearForm);
});

function clearForm() {
    $('#id_user').val('');
    $('#user_code').val('');
    $('#user_name').val('');
}