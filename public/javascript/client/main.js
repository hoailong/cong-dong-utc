$(document).ready(function() {
    //config moment locale
    moment.locale('vi');

    //config toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        // positionClass: "toast-bottom-right",
        timeOut: 5000
    };

    $('.toggle-nav').click(function() {
        $(this).toggleClass('active');
        $('nav').toggleClass('active');
    });

    const href = window.location.pathname;
    if(href === '/') {
        $('nav li:first a').addClass('active');
    } else {
        $('nav li a').each(function(i, v) {
            if (href.includes($(v).attr('href')) && i!==0)
                $(v).addClass('active')
        });
    }

    $(window).scroll(function() {
        $(this).scrollTop() > 100 ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
    });
    $(".scroll-to-top").click(function() {
        return $("html, body").animate({
            scrollTop: 0
        }, 800), !1
    });

    $.fn.select2.defaults.set( "theme", "bootstrap" );

    $(".subject_select").select2({
        placeholder: "Chọn môn học",
        allowClear: true
    });

    $(".faculty_select").select2({
        placeholder: "Chọn khoa",
        allowClear: true
    });

    $(".custom-file-input").on("change", function() {
        $('.photo-preview').empty().show();
        if (this.files) {
            const filesAmount = this.files.length;
            if(filesAmount === 0) {
                toastr.error('Chọn ít nhất 1 file');
                $('.photo-preview').hide();
                $('#images_files').val(null);
            } else if(filesAmount >= 15) {
                toastr.error('Không upload > 15 file !');
                $('.photo-preview').hide();
                $('#images_files').val(null);
            } else {
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
            formData.append('title', $('#title').val());

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

    //contact form send
    $('#btn_send_contact').click(function(){
        const contact_name = $('#contact_name').val();
        const contact_email = $('#contact_email').val();
        const contact_phone = $('#contact_phone').val();
        const contact_content = $('#contact_content').val();

        const data = { contact_name, contact_email, contact_phone, contact_content };
        fetch('/contact/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                swal("Cảm ơn bạn đã liên hệ!", "Chúng tôi đã ghi nhận và sẽ sớm phản hồi lại", "success")
                    .then(val => location.href = '/');
                setTimeout(function(){
                    location.href = '/'
                }, 3000)
            })
            .catch(error => console.log(error));
    });
});

function clearUploadForm() {
    $('#note').val('');
    $('#title').val('');
    $('#privacy').val('public');
    $('#images_files').val(null);
    $('.photo-preview').empty().hide();
}
function getSlug(str) {
    slug = str.toLowerCase();
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    slug = slug.replace(/ /gi, "-");
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    slugg = slug.replace(/[`“”~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return slug;
}

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 100,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});