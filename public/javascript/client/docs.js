let file_images = [];
let file_files = [];

$(document).ready(function() {
    $('.btn-upload').removeClass('d-none');

    $(".subject_select").select2({
        placeholder: "Chọn môn học",
        allowClear: true
    });

    $(".faculty_select").select2({
        placeholder: "Chọn khoa",
        allowClear: true
    });

    $(document).on('change', '#imageUpload', function(){
        if (this.files && this.files[0]) {
            $(this).siblings('.image-picker').show();
            let count_current = file_images.length;
            // $(this).siblings('.image-picker').find('.image-picker-image-container').remove();
            [...this.files].forEach((file, i) => {
                if (file.type.startsWith('image/')) {
                    let reader = new FileReader();
                    reader.onload = e => $(this).siblings('.image-picker').prepend(
                        `<div class="image-picker-image-container" data-imageID="${i+count_current}">
                            <span class="image-picker-image-del"><i class="fa fa-times"></i></span>
                            <div class="image-picker-image" style="background-image: url('${e.target.result}')"></div>
                        </div>`);
                    reader.readAsDataURL(file);
                    file_images.push(file);
                }
            });
        }
    });

    $(document).on('change', '#fileUpload', function(){
        if (this.files && this.files[0]) {
            $(this).siblings('.file-picker').show();
            let count_current = file_files.length;
            // $(this).siblings('.image-picker').find('.image-picker-image-container').remove();
            [...this.files].forEach((file, i) => {
                if (file.size < 10000000) {
                    $(this).siblings('.file-picker').find('ul').prepend(
                        `<li data-fileID="${i+count_current}">${file.name}
                            <button class="file-picker-file-del" title="Xóa file">x</button>
                        </li>`);
                    file_files.push(file);
                } else {
                    toastr.error('File đính kèm không quá 10MB !');
                }
            });
        }
    });

    $(document).on('click', '.image-picker-image-del', function(){
        let id =  parseInt($(this).closest('.image-picker-image-container').attr('data-imageID'));
        file_images.splice(id, 1);
        $(this).closest('.image-picker-image-container').remove();
    });
    $(document).on('click', '.file-picker-file-del:not(".add")', function(){
        let id =  parseInt($(this).closest('li').attr('data-fileID'));
        file_files.splice(id, 1);
        $(this).closest('li').remove();
    });

    // $(".custom-file-input").on("change", function() {
    //     $('.photo-preview').empty().show();
    //     if (this.files) {
    //         const filesAmount = this.files.length;
    //         if(filesAmount === 0) {
    //             toastr.error('Chọn ít nhất 1 file');
    //             $('.photo-preview').hide();
    //             $('#images_files').val(null);
    //         } else if(filesAmount >= 15) {
    //             toastr.error('Không upload > 15 file !');
    //             $('.photo-preview').hide();
    //             $('#images_files').val(null);
    //         } else {
    //             let files = `<div><ul>`;
    //             [...this.files].forEach(file => {
    //                 if (file.type.startsWith('image/')) {
    //                     let reader = new FileReader();
    //                     reader.onload = e => $('.photo-preview').append(`<img class="img-preview" src= "${e.target.result}" alt="${file.name}"/>`);
    //                     reader.readAsDataURL(file);
    //                 } else {
    //                     files+=`<li><i class="fa fa-file-word-o"></i> ${file.name}</li>`
    //                 }
    //             });
    //             files+= `</ul></div>`;
    //             $('.photo-preview').append(files);
    //
    //         }
    //     }
    // });

    $('#btn-upload').click(async function(){
        let filesAmount = file_images.length + file_files.length;
        if(filesAmount === 0) {
            toastr.error('Chọn ít nhất 1 file');
        } else if(filesAmount >= 15) {
            toastr.error('Không upload > 15 file !');
        } else {
            let formData = new FormData();

            formData.append('id_subject', $('#id_subject').val());
            formData.append('id_faculty', $('#id_faculty').val());
            formData.append('type', $('#type').val());
            formData.append('privacy', $('#privacy').val());
            formData.append('id_year', $('#id_year').val());
            formData.append('note', $('#note').val());
            formData.append('title', $('#title').val());
            formData.append('folder','docs');
            for(let file of file_images) {
                formData.append('files', file);
            }
            for(let file of file_files) {
                formData.append('files', file);
            }
            let response = await fetch('/docs/upload', {
                method: 'POST',
                body: formData
            });

            response = await response.json();

            if(response.status === 200) {
                if(response.created) {
                    // toastr.success('Upload thành công. Đợi người kiểm duyệt duyệt!');
                    swal("Upload thành công!", "Tài liệu sẽ được người kiểm duyệt kiểm tra và duyệt", "success")
                        .then(val => location.href = '/docs');
                    setTimeout(function(){
                        location.href = '/docs'
                    }, 3000)
                    $('#upload_modal').modal('hide');
                    clearUploadForm();
                }
            }
            console.log(response);
        }
    });
});

function clearUploadForm() {
    $('#note').val('');
    $('#title').val('');
    $('#privacy').val('public');
    $('#images_files').val(null);
    $('.photo-preview').empty().hide();
}

