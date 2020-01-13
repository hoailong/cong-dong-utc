let continueLoad = true;
let from = 0;
const count = 20;

$(document).ready(function() {
    //config toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        // positionClass: "toast-bottom-right",
        timeOut: 5000
    };
    $.fn.select2.defaults.set( "theme", "bootstrap" );

    $(".subject_select").select2({
        placeholder: "Chọn môn học",
        allowClear: true
    });

    $(".faculty_select").select2({
        placeholder: "Chọn khoa",
        allowClear: true
    });

    $(window).scroll(function() {
        if(continueLoad && $(window).scrollTop() == $(document).height() - $(window).height()) {
            $('.load-data').show();
            continueLoad = false;
            from = from + count;
            // let subjectSearch = $('#subjectSearch').val();
            fetch(`/subject/${from}/${count}`)
                .then(res => res.json())
                .then(data => {
                    let newData = ``;
                    data.forEach(subject => newData+= `<div class="folder">
                                                <div class="folder-infor">
                                                    <a href="/s/${ subject.id_subject }" id="${ subject.id_subject }">
                                                        <img src="/img/icon-folder.svg" alt="">
                                                        <span class="detail font-weight-bold"><i class="fa fa-file-text"></i> 8</span>
                                                        <h6 class="subject-name">${ subject.subject_name }</h6>
                                                    </a>
                                                </div>
                                            </div>`);
                    $(newData).appendTo('.list-subject').hide().fadeIn(1500);
                    $(window).scrollTop($(window).scrollTop()-5);
                    $('.load-data').hide();
                    if(data.length === count) continueLoad = true;
                })
                .catch(err => console.log(err));
        } else {
            $('.load-data').hide();
        }
    });

    $('#subjectSearch').on('keyup change', function(){
        let key = $(this).val().toUpperCase();
        $('.folder .subject-name').each((i, v) => {
            if ($(v).text().toUpperCase().includes(key)) {
                $(v).closest('.folder').removeClass('d-none');
            } else {
                $(v).closest('.folder').addClass('d-none');
            }
        });
        if($('.folder:not(.d-none)').length === 0) {
            $('.list-subject h3').removeClass('d-none');
        } else {
            $('.list-subject h3').addClass('d-none');
        }
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

    $(document).on('change', '#faculty_search, #type_search', function() {
        const id_faculty = $('#faculty_search').val();
        const id_type = $('#type_search').val();
        $('.vote-item .vote-info').each((i, v) => {
            if (($(v).attr('data-faculty') === id_faculty || id_faculty === "0")
                    && ($(v).attr('data-type') === id_type || id_type === "0")) {
                $(v).closest('.vote-item ').removeClass('d-none');
            } else {
                $(v).closest('.vote-item ').addClass('d-none');
            }
        });
        if($('.vote-item:not(.d-none)').length === 0) {
            $('#show-none').removeClass('d-none');
        } else {
            $('#show-none').addClass('d-none');
        }
    });

    function clearUploadForm() {
        $('#note').val('');
        $('#title').val('');
        $('#privacy').val('public');
        $('#images_files').val(null);
        $('.photo-preview').empty().hide();
    }
});

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