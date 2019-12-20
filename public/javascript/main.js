$(document).ready(function() {
    //config toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        // positionClass: "toast-bottom-right",
        timeOut: 5000
    };

    $(".custom-file-input").on("change", function() {
        $('.photo-preview').empty().show();
        if (this.files) {
            const filesAmount = this.files.length;
            if(filesAmount < 15) {
                let files = `<div><ul>`;
                [...this.files].forEach(file => {
                    if (file.type.startsWith('image/')) {
                        let reader = new FileReader();
                        reader.onload = e => $('.photo-preview').append(`<img class="img-preview" src= "${e.target.result}" alt="${file.name}"/>`);
                        reader.readAsDataURL(file);
                    } else {
                        files+=`<li><i class="fa fa-file-word-o"></i> ${file.name}</li>`
                    }
                });
                files+= `</ul></div>`;
                $('.photo-preview').append(files);
                $(this).siblings(".custom-file-label").addClass("selected").html(filesAmount + ' files');
            } else {
                toastr.error('Không upload > 15 file !');
                $('.photo-preview').hide();
                $('#images_files').val(null);
            }
        }
    });

    $('#btn-upload').click(async function(){
        let filesInput = $('#upload_files')[0].files;
        if(filesInput.length > 0) {
            let formData = new FormData();

            for(let file of [...filesInput]) {
                formData.append('files', file);
            }

            formData.append('id_subject', $('#id_subject').val());
            formData.append('id_faculty', $('#id_faculty').val());
            formData.append('type', $('#type').val());
            formData.append('privacy', $('#privacy').val());
            formData.append('id_year', $('#id_year').val());
            formData.append('note', $('#note').val());

            let response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            response = await response.json();

            if(response.status === 200) {
                if(response.created) {
                    toastr.success('Upload thành công. Đợi người kiểm duyệt duyệt!');
                    $('#upload_modal').modal('hide');
                    clearUploadForm();
                }
            }
            console.log(response);
        } else {
            toastr.error('Chọn ít nhất 1 file !');
        }
    });

    function clearUploadForm() {
        $('#note').val('');
        $('#privacy').val('public');
        $('#images_files').val(null);
        $('.photo-preview').empty().hide();
    }
});