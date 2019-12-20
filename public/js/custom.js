//Create by HoaiPV 12/12/2019

const CLIENT_ID = 'e24070879233fe6';
const ACCESS_TOKEN = '5c5adefbb11b72d809ce0b3f0dcf969e66431a46';
const API_URL = 'https://api.imgur.com/3/album/';
const GET_ALBUMS_URL = 'https://api.imgur.com/3/account/mrhoai/albums/';
const CREATE_ALBUM_URL = 'https://api.imgur.com/3/album';
const UPLOAD_IMAGE_TO_ALBUM_URL = 'https://api.imgur.com/3/image';
const GET_ALL_ALBUM_URL = 'https://api.imgur.com/3/account/mrhoai/albums/';

$(document).ready(function() {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        positionClass: "toast-bottom-right",
        timeOut: 5000
    };
    load_album();
    $('.toggle-nav').click(function() {
        $(this).toggleClass('active');
        $('nav').toggleClass('active');
    });
    $(".custom-file-input").on("change", function() {
        if (this.files) {
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            const filesAmount = this.files.length;
            $('.photo-preview').empty();
            [...this.files].forEach(file => {
                if (validImageTypes.includes(file.type)) {
                    let reader = new FileReader();
                    reader.onload = e => $('.photo-preview').append(`<img class="img-preview" src= "${e.target.result}" alt="${file.name}"/>`);
                    reader.readAsDataURL(file);
                }
            })
            $(this).siblings(".custom-file-label").addClass("selected").html(filesAmount + ' files');
        }
    });

    $('#btn-create-album').click(async function() {
        toggleLoading();
        let cover_id = '';
        try {
            let album_id = await create_album();
            if ($("#album_files")[0].files.length > 0) {
                await Promise.all(
                    [...$("#album_files")[0].files].map(async file => {
                        const id = await upload_image(file, album_id)
                        cover_id = id;
                    })
                )
            }
            $('#create_album_modal').modal('hide');
            toggleLoading();
            load_album();
            toastr.success('Tạo mới album ảnh thành công nha bro!');
            clearAlbumForm();
        } catch (err) {
            console.log(err);
            toastr.error('Tạo mới album ảnh thất bại!');
        }
    });

    $('#btn-upload-image').click(async function() {
        toggleLoading();
        let cover_id = '';
        let album_id = $('#album').val();
        try {
            if ($("#images_files")[0].files.length > 0) {
                await Promise.all(
                    [...$("#images_files")[0].files].map(async file => {
                        const id = await upload_image(file, album_id)
                        cover_id = id;
                    })
                )
            }
            $('#upload_image_modal').modal('hide');
            toggleLoading();
            load_album();
            toastr.success('Upload ảnh thành công nha bro!');
            clearAlbumForm();
        } catch (err) {
            console.log(err);
            toastr.error('Tạo mới album ảnh thất bại rồi bro ơi!');
        }
    });

    $('.albums').on('click', '.card-img-top', async function(event){
        let album_id = $(this).closest('.card').attr('id');
        await load_image_album(album_id);
        let options = { index: $(this), event: event, startSlideshow: true, transitionSpeed: 400, slideshowInterval: 5000, hidePageScrollbars: false, disableScroll: true};
        let links = $('#links a');
        blueimp.Gallery(links, options);
    });

    async function create_album() {
        let formdata = new FormData();
        let title = $('#title').val().trim() !== '' ? $('#title').val() : 'nooo title :)))';
        formdata.append("privacy", 'public');
        formdata.append("title", title);
        formdata.append("description", $('#description').val());
        return await fetch(CREATE_ALBUM_URL, {
                method: 'post',
                body: formdata,
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(result => result.data.id)
    }

    async function upload_image(image, album) {
        let formdata = new FormData();
        formdata.append("image", image);
        formdata.append("album", album);
        formdata.append("title", $('#title_img').val().trim() !== '' ? $('#title_img').val() : 'nooo title :)))');
        formdata.append("description", $('#description_img').val().trim() !== '' ? $('#description_img').val() : 'nooo description :)))');
        return await fetch(UPLOAD_IMAGE_TO_ALBUM_URL, {
                method: 'post',
                body: formdata,
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(result => result.data.id)
        // , 'Access-Control-Allow-Origin': '*'
    }

    async function load_image_album(album_id){
        toggleLoading();
        const URL = API_URL + album_id + '/images';
        await fetch(URL, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
        .then(res => res.json())
        .then(result => {
            let images = ``;
            result.data.forEach(img => {
                images += `<a href="${img.link}" title="${img.title || 'No title :))'}" data-gallery>
                            <img src="${img.link}" alt="${img.title || 'No title :))'}" width="200px"/>
                           </a>`;
            });
            $('#links').empty().append(images);
            toggleLoading();
        })
        .catch(error => console.log('error', error));
    }

    function load_album() {
        toggleLoading();
        fetch(GET_ALBUMS_URL, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(result => {
                let albums = ``;
                result.data.forEach(album => {
                    // albums += `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                    albums += `<div class="card" id=${album.id}>
                                  <div class="card-img">
                                      <img class="card-img-top" src= "https://i.imgur.com/${album.cover}.jpg" alt="Card image cap"/>
                                  </div>
                                  <div class="count-image">${album.images_count}</div>
                                  <div class="card-body">
                                      <p class="card-title">${album.title}</p>
                                      <p class="card-text">
                                          <small class="text-muted"><i class="fa fa-calendar"></i> ${moment.unix(album.datetime).format('DD/MM/YYYY, hh:mm:ss')}</small>
                                      </p>
                                  </div>
                              </div>
                              </div>`;
                        //   </div>`;
                });
                $('.albums').empty().append(albums);
            })
            .catch(error => console.log('error', error));

        fetch(GET_ALL_ALBUM_URL, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
        .then(res => res.json())
        .then(result => {
            let albums = ``;
            result.data.forEach(album => {
                albums += `<option value="${album.id}">${album.title} - ${album.images_count} ảnh</option>`;
            });
            $('#album').empty().append(albums);
            toggleLoading();
        })
        .catch(error => console.log('error', error));
    }

    function clearAlbumForm() {
        $('#title').val('');
        $('#description').val('');
        $('#album_files').val(null);
        $('#title_img').val('');
        $('#description_img').val('');
        $('#images_files').val(null);
        $('.photo-preview').empty().text('Xem trước...');
    }

    function toggleLoading() {
        $(".preloader").toggle();
    }

});