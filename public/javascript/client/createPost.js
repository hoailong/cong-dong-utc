let file_images = [];
let file_files = [];

$(document).ready(function(){
    $('#content').redactor();
    $('#content').setCode($('#content').attr('data-code'));
    // $('#summernote').summernote({
    //     placeholder: 'Hạn chế chèn ảnh / video.\nNếu cần thiết hãy kèm dưới file đính kèm',
    //     tabsize: 2,
    //     height: 300
    // });
    //
    // $('#summernote').summernote('code', $('#summernote').attr('data-code'));

    $('#btn-preview').click(function(){
        const content = $('#content').getCode();
        $('#preview-content').empty().append(content);
        $('.post-preview').show();
        // console.log(content);
    });

    $('.close-preview').click(function(){
        $('.post-preview').hide();
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

    //create post forum

    $('#btn-post').click(function(){
        // const id_post = $('#postId').val();
        // const code = getSlug(title);
        // const id_topic = $('#topic').val();
        // const content = $('#summernote').summernote('code');
        // const data = { id_post, title, code, id_topic, content };

        const title = $('#postTitle').val();
        if(title.trim() !== '') {
            let formData = new FormData();
            formData.append('id_post', $('#postId').val());
            formData.append('title', title);
            formData.append('code', getSlug($('#postTitle').val()));
            formData.append('id_topic', $('#topic').val());
            formData.append('content',  $('#content').getCode());
            // formData.append('content', $('#summernote').summernote('code'));
            // formData.append('content', $('#content').val());
            formData.append('folder','forum');
            for(let file of file_images) {
                formData.append('files', file);
            }
            for(let file of file_files) {
                formData.append('files', file);
            }
            fetch('/forum/post/', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => location.href = `/forum/p/${data.data.code}.${data.data.id_post}`)
                .catch(error => console.log(error));
        } else {
            toastr.error('Tiêu đề không được để trống!');
        }
    });
});