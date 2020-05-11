// filter COMMENTS
const PARENT_COMMENTS = g_comments.filter(cmt => cmt.id_parent === 0);
const COMMENTS = {};
PARENT_COMMENTS.forEach(p_cmt => COMMENTS[p_cmt.id_comment] =g_comments.reverse().filter(cmt => cmt.id_parent === p_cmt.id_comment));
let comments_temp = {...COMMENTS};

const COUNT_REPLY_REP_VIEW = 4;
const COUNT_REPLY_PAGE = 5;
const TOTAL_REPLY_PAGE = Math.ceil(PARENT_COMMENTS.length / COUNT_REPLY_PAGE);
const LONG_MODE = TOTAL_REPLY_PAGE > 5;
let current_page = 1;
const g_commentLikes = [];
//group comment like
const commentLikes =  g_commentLikes.reduce(function(groups, item) {
    const val = item['id_comment'];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups
}, {});

$(document).ready(function(){
    console.log(g_comments);

    showReplys(current_page);


    // on like button
    $(document).on('click', '.btn-like', function(){
        $(this).prop('disabled', true);
        const id_doc = $(this).attr('data-postID');
        fetch('/docs/like/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_doc })
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === 200) {
                    $(this).removeClass('btn-like').addClass('btn-liked').attr('title', 'Bỏ thích').prop('disabled', false);
                    $(this).find('.like-count').text(parseInt($(this).find('.like-count').text()) + 1);
                } else {
                    $(this).prop('disabled', false);
                    toastr.error('Lỗi!');
                }
            })
            .catch(error => console.log(error));
    });

    // on unlike button
    $(document).on('click', '.btn-liked', function(){
        $(this).prop('disabled', true);
        const id_doc = $(this).attr('data-postID');
        fetch('/docs/unlike/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_doc })
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === 200) {
                    $(this).removeClass('btn-liked').addClass('btn-like').attr('title', 'Thích').prop('disabled', false);
                    $(this).find('.like-count').text(parseInt($(this).find('.like-count').text()) - 1);
                } else {
                    $(this).prop('disabled', false);
                    toastr.error('Lỗi!');
                }
            })
            .catch(error => console.log(error));
    });

    // on pagination reply
    $(document).on('click', '.reply-pagination a', function(){
        showReplys($(this).attr('data-page'));
    });

    //upload image reply
    $(document).on('click', '.post-reply-upload', function(){
        $(this).closest('.reply-form').find('.image-upload-input').trigger( 'click' );
    });

    $(document).on('click', '.image-picker-image-del', function(){
        $(this).closest('.image-picker').find('.image-upload-input').val(null).attr('data-deleted', 'true');
        $(this).closest('.image-picker-image-container').remove();
    });

    $(document).on('change', '.image-upload-input', function(){
        if (this.files && this.files[0]) {
            $(this).closest('.image-picker').find('.image-picker-image-container').remove();
            let file = this.files[0];
            if (file.type.startsWith('image/')) {
                let reader = new FileReader();
                reader.onload = e =>  $(this).closest('.image-picker').append(`<div class="image-picker-image-container">
                                    <span class="image-picker-image-del"><i class="fa fa-times"></i></span>
                                    <img src="${e.target.result}" style="width: 100%">
                                </div>`);
                reader.readAsDataURL(file);
            } else {
                toastr.error('Vui lòng chọn 1 file ảnh!');
            }
        }
    });

    // on like comment
    $(document).on('click', '.reply-action-like', function(){
        $(this).prop('disabled', true);
        const id_doc = $(this).closest('.post-reply').attr('data-postID');
        const id_comment = $(this).closest('.reply-item').attr('data-cmtid');
        fetch('/docs/like-comment/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_doc, id_comment })
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === 200) {
                    $(this).removeClass('reply-action-like').addClass('reply-action-liked').prop('disabled', false);
                    const like_count = parseInt($(this).find('.like-count').text()) + 1;
                    $(this).find('.like-count').text(like_count ? like_count : 1);
                } else {
                    $(this).prop('disabled', false);
                    toastr.error('Lỗi!');
                }
            })
            .catch(error => console.log(error));
    });

    // on unlike comment
    $(document).on('click', '.reply-action-liked', function(){
        $(this).prop('disabled', true);
        const id_doc = $(this).closest('.post-reply').attr('data-postID');
        const id_comment = $(this).closest('.reply-item').attr('data-cmtid');
        fetch('/docs/unlike-comment/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ id_doc, id_comment })
        })
            .then(res => res.json())
            .then(data => {
                if(data.status === 200) {
                    $(this).removeClass('reply-action-liked').addClass('reply-action-like').prop('disabled', false);
                    const like_count = parseInt($(this).find('.like-count').text()) - 1;
                    $(this).find('.like-count').text(like_count !== 0 ? like_count : '');
                } else {
                    $(this).prop('disabled', false);
                    toastr.error('Lỗi!');
                }
            })
            .catch(error => console.log(error));
    });

    //on type comment
    $(document).on('change keyup', '.reply-type', function(){
        if($(this).val().trim() !== '') {
            $(this).closest('.reply-form').find('.btn-post-cmt').prop('disabled', false);
        } else {
            $(this).closest('.reply-form').find('.btn-post-cmt').prop('disabled', true);
        }
    });

    $(document).on('click', '.reply-action-cancel', function(){
        $(this).closest('.reply-box').find('.new-reply').first().remove();

        $(this).hide();
        $(this).parent().find('.reply-action-rep').show();
    });

    $(document).on('click', '.reply-action-cancel-edit', function(){
        $(this).closest('.reply-box').find('.edit-reply').remove();
        $(this).closest('.reply-action').siblings('.reply-container').show();
        $(this).siblings('.reply-action-report').after('<span class="reply-action-edit">Sửa</span>');
        $(this).remove();
    });

    $(document).on('click', '.load-more-reply', function(){
        const id_comment = $(this).closest('.reply-item').attr('data-cmtid');
        let moreCmt = ``;
        comments_temp[id_comment].forEach(cmt => {
            moreCmt += replyItem(cmt);
        });
        $(this).siblings('.reply-rep-container').prepend(moreCmt);
        $(this).remove();
        comments_temp[id_comment].length = 0;
    });

    $(document).on('click', '.reply-action-edit', function(){
        const id_comment = $(this).closest('.reply-item').attr('data-cmtid');
        let content = $(this).closest('.reply-box').find('.reply-content').attr('data-replyContent');
        let img = $(this).closest('.reply-box').find('.reply-image img').attr('src');
        $(this).closest('.reply-action').siblings('.reply-container').hide();
        $(this).closest('.reply-box').prepend(`
                        <div class="edit-reply" style="display:flex"><div class="reply-form">
                            <div class="form-group">
                                <textarea class="form-control reply-type" rows="1" id="reply" placeholder="Viết bình luận nào bạn ơi..." oninput="auto_grow(this)">${content}</textarea>
                                <div class="image-picker box">
                                    <input class="image-upload-input" type="file" accept="image/*" style="display: none;" data-deleted="false">
                                    ${img ? `<div class="image-picker-image-container">
                                                    <img src="${img}" style="width: 100%">
                                                    <span class="image-picker-image-del"><i class="fa fa-times"></i></span>
                                                </div>` : ``}
                                </div>
                                <div class="pull-right mt-2">
                                    <button title="Upload ảnh" class="btn post-reply-upload">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20"><g fill="#00BAD7"><circle cx="10.5" cy="5.143" r="1.357"></circle><path d="M20.69 1.762A2.582 2.582 0 0 0 18.905.88L9.31.191h-.191c-1.333 0-2.476 1.047-2.595 2.404L5.57 16.357a2.58 2.58 0 0 0 .62 1.881 2.582 2.582 0 0 0 1.785.881l9.62.667h.19a2.5 2.5 0 0 0 1.69-.643 2.582 2.582 0 0 0 .881-1.786l.429-6 .547-7.762c.048-.643-.19-1.31-.643-1.833zM7.738 2.69a1.406 1.406 0 0 1 1.405-1.309h.095l9.62.667a1.412 1.412 0 0 1 1.309 1.5l-.453 6.333-2.476-2.833a.598.598 0 0 0-.833-.072l-4.786 3.976-1.38-1.571a.594.594 0 0 0-.81-.071l-2.286 1.833.595-8.453z"></path><path d="M19.167 17.31c-.024.38-.19.714-.477.952a1.431 1.431 0 0 1-.928.333h-.095l-9.62-.666a1.412 1.412 0 0 1-1.309-1.5L7 12.739l2.69-2.168 2.453 2.762c.119.143.286.19.452.19a.647.647 0 0 0 .405-.142.598.598 0 0 0 .048-.833l-.62-.69 4.31-3.596 2.857 3.31-.428 5.738zM2.571 1.738l2.667-.214c.143-.453.381-.881.667-1.238L2.476.57c-.69.048-1.31.381-1.762.905a2.579 2.579 0 0 0-.619 1.881L1.19 17.095c.048.69.381 1.31.905 1.762a2.582 2.582 0 0 0 1.667.62h.214l1.214-.096-.142-.143a4.931 4.931 0 0 1-.643-.976l-.548.048a1.44 1.44 0 0 1-1.024-.334 1.443 1.443 0 0 1-.5-.952L1.238 3.286a1.44 1.44 0 0 1 .333-1.024 1.44 1.44 0 0 1 1-.524z"></path></g>
                                        </svg>
                                    </button>
                                    <button class="btn btn-sm btn-blue btn-post-cmt" data-editID="${id_comment}" disabled>Đăng</button>
                                </div>
                            </div>
                        </div>`);
        // $(this).closest('.reply-box').find('textarea').oninput();
        $(this).closest('.reply-box').find('.btn-post-cmt').prop('disabled', false);
        $(this).closest('.reply-box').find('textarea').trigger('input');
        $(this).siblings('.reply-action-report').after('<span class="reply-action-cancel-edit">Hủy</span>');
        $(this).remove();
    });

    $(document).on('click', '.reply-action-delete', function(){
        const id_comment = $(this).closest('.reply-item').attr('data-cmtid');
        swal({
            title: "Xóa bình luận",
            text: "Bạn có chắc muốn xóa bình luận?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    fetch('/docs/delete-comment/', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ id_comment })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if(data.status === 200) {
                                $(this).closest('.reply-item').remove();
                            }
                        })
                        .catch(error => console.log(error));
                }
            });
    });
    //on click rep comment
    $(document).on('click', '.reply-action-rep', function(){
        $(this).closest('.reply-action').after(`                    
                    <div class="new-reply">
                        <img src="/img/profile/${g_user.id_user}.jpg" class="rounded-circle reply-avatar" alt="UTC Community">
                        <div class="reply-form">
                            <div class="form-group">
                                <textarea class="form-control reply-type" rows="1" id="reply" placeholder="Viết bình luận nào bạn ơi..." oninput="auto_grow(this)"></textarea>
                                <div class="image-picker box">
                                    <input class="image-upload-input" type="file" accept="image/*" style="display: none;" data-deleted="false">
                                </div>
                                <div class="pull-right mt-2">
                                    <button title="Upload ảnh" class="btn post-reply-upload">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20"><g fill="#00BAD7"><circle cx="10.5" cy="5.143" r="1.357"></circle><path d="M20.69 1.762A2.582 2.582 0 0 0 18.905.88L9.31.191h-.191c-1.333 0-2.476 1.047-2.595 2.404L5.57 16.357a2.58 2.58 0 0 0 .62 1.881 2.582 2.582 0 0 0 1.785.881l9.62.667h.19a2.5 2.5 0 0 0 1.69-.643 2.582 2.582 0 0 0 .881-1.786l.429-6 .547-7.762c.048-.643-.19-1.31-.643-1.833zM7.738 2.69a1.406 1.406 0 0 1 1.405-1.309h.095l9.62.667a1.412 1.412 0 0 1 1.309 1.5l-.453 6.333-2.476-2.833a.598.598 0 0 0-.833-.072l-4.786 3.976-1.38-1.571a.594.594 0 0 0-.81-.071l-2.286 1.833.595-8.453z"></path><path d="M19.167 17.31c-.024.38-.19.714-.477.952a1.431 1.431 0 0 1-.928.333h-.095l-9.62-.666a1.412 1.412 0 0 1-1.309-1.5L7 12.739l2.69-2.168 2.453 2.762c.119.143.286.19.452.19a.647.647 0 0 0 .405-.142.598.598 0 0 0 .048-.833l-.62-.69 4.31-3.596 2.857 3.31-.428 5.738zM2.571 1.738l2.667-.214c.143-.453.381-.881.667-1.238L2.476.57c-.69.048-1.31.381-1.762.905a2.579 2.579 0 0 0-.619 1.881L1.19 17.095c.048.69.381 1.31.905 1.762a2.582 2.582 0 0 0 1.667.62h.214l1.214-.096-.142-.143a4.931 4.931 0 0 1-.643-.976l-.548.048a1.44 1.44 0 0 1-1.024-.334 1.443 1.443 0 0 1-.5-.952L1.238 3.286a1.44 1.44 0 0 1 .333-1.024 1.44 1.44 0 0 1 1-.524z"></path></g>
                                        </svg>
                                    </button>
                                    <button class="btn btn-sm btn-blue btn-post-cmt" disabled>Đăng</button>
                                </div>
                            </div>
                        </div>
                    </div>`);
        $(this).closest('.reply-box').find('textarea').focus();
        $(this).hide();
        $(this).parent().find('.reply-action-cancel').show();
    });

    //save new comment
    $(document).on('click', '.btn-post-cmt', function(){
        const files = $(this).closest('.reply-form').find('.image-upload-input')[0].files[0];
        const id_comment = $(this).attr('data-editID');
        const id_doc = $(this).closest('.post-reply').attr('data-postID');
        const content = $(this).closest('.reply-form').find('#reply').val();
        const id_parent = parseInt($(this).parents('.reply-item').last().attr('data-cmtID')) || 0;
        const id_user_tag = $(this).parents('.reply-item').length > 0 ? $(this).parents('.reply-item').attr('data-author').split('.')[1] : '';
        const user_name_tag = $(this).parents('.reply-item').length > 0 ? $(this).parents('.reply-item').attr('data-author').split('.')[0] : '';
        const img_deleted = $(this).closest('.reply-form').find('.image-upload-input').attr('data-deleted');

        let formData = new FormData();

        formData.append('id_comment', id_comment);
        formData.append('id_doc', id_doc);
        formData.append('content', content);
        formData.append('id_parent', id_parent);
        formData.append('id_user_tag', id_user_tag);
        formData.append('user_name_tag', user_name_tag);
        formData.append('img_deleted', img_deleted);
        formData.append('folder','comment');
        formData.append('files', files);
        fetch('/docs/comment/', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                const cmt = data.data;
                if(data.created) {
                    $(this).closest('.reply-box').find('.reply-action-rep').show();
                    $(this).closest('.reply-box').find('.reply-action-cancel').hide();
                    if($(this).closest('.reply-item').length === 0) {
                        $('.replys').prepend(replyItem(cmt));
                        $(this).closest('.new-reply').find('#reply').val('');
                        $(this).closest('.new-reply').find('.btn-post-cmt').prop('disabled', true);
                    } else {
                        if($(this).closest(`.reply-item[data-cmtid='${cmt.id_parent}']`).find('.reply-rep-container').length === 0) {
                            $(this).closest(`.reply-item[data-cmtid='${cmt.id_parent}']`).find('.reply-box').append(`<div class="reply-rep-container">${replyItem(cmt)}</div>`);
                        } else {
                            $(this).closest(`.reply-item[data-cmtid='${cmt.id_parent}']`).find('.reply-rep-container').append(replyItem(cmt));
                        }
                        $(this).closest('.new-reply').remove();
                    }
                } else {
                    let old_img = $(this).closest('.reply-box').find('.reply-image img').attr('src');
                    if(cmt.img) {
                        if(old_img) {
                            $(this).closest('.reply-box').find('.reply-image img').attr('src', `${cmt.img.includes('.') ? '/upload/photo/' + cmt.img : 'https://drive.google.com/uc?id=' + cmt.img}`);
                        } else {
                            $(this).closest('.reply-box').find('.reply-content').append(`<div class="reply-image"><img src="${cmt.img.includes('.') ? '/upload/photo/' + cmt.img : 'https://drive.google.com/uc?id=' + cmt.img}"></div>`);
                        }
                    } else {
                        $(this).closest('.reply-box').find('.reply-image').remove();
                    }
                    $(this).closest('.reply-box').find('.reply-content').first().attr('data-replycontent', cmt.content);
                    $(this).closest('.reply-box').find('.reply-content-detail').first().html(cmt.content.replace(new RegExp('\n', 'g'), "<br />"));
                    $(this).closest('.reply-box').find('.reply-action-cancel-edit').trigger('click');
                }
                $(this).closest('.reply-form').find('.image-picker-image-container').remove();
                $(this).closest('.reply-form').find('textarea').css('height', '20px');
            })
            .catch(error => console.log(error));
    });
});


function showReplys(page){
    page = parseInt(page);
    if(page > TOTAL_REPLY_PAGE) {
        page = TOTAL_REPLY_PAGE
    } else if(page < 1) {
        page = 1
    }
    //pagi
    if(TOTAL_REPLY_PAGE > 1) {
        let pages = ``;
        for(let j = page-2; j <= page+2; j++) {
            let i = page - 2 <= 0 ? j + (3-page) : (page + 2 > TOTAL_REPLY_PAGE ? j-(page - TOTAL_REPLY_PAGE + 2) : j );
            if(i <= TOTAL_REPLY_PAGE && i > 0) {
                pages+= `<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="#page=${i}" data-page="${i}">${i}</a></li>`;
            }
        }
        if(LONG_MODE){
            $('.reply-pagination ul').empty().append(`  
            ${page > 1 ? `<li class="page-item"><a class="page-link" href="#page=${page-1}" data-page="${page-1}"><i class="fa fa-backward"></i></a></li>` : ''}
            ${pages}
            ${page < TOTAL_REPLY_PAGE ? `<li class="page-item"><a class="page-link" href="#page=${page+1}" data-page="${page+1}"><i class="fa fa-forward"></i></a></li>` : ''}
        `);
        } else {
            $('.reply-pagination ul').empty().append(pages);
        }
    }
    //load comment
    const start = (page-1)*COUNT_REPLY_PAGE;
    const end = page * COUNT_REPLY_PAGE ;
    let cmts = ``;
    PARENT_COMMENTS.slice(start, end).forEach(cmt => {
        let reply = ``;
        let count_reply = comments_temp[cmt.id_comment].length;
        if(count_reply > COUNT_REPLY_REP_VIEW) {
            for(let i = count_reply - COUNT_REPLY_REP_VIEW ; i < count_reply; i++) {
                reply+= replyItem(comments_temp[cmt.id_comment][i]);
            }
            comments_temp[cmt.id_comment].length = count_reply-4;
        } else {
            comments_temp[cmt.id_comment].forEach(cmt2 => {
                reply+= replyItem(cmt2);
            });
        }
        cmts+= replyItem(cmt, reply, count_reply);
    });
    $('.replys').empty().append(cmts);
}

function replyItem(cmt, reply = '', loadMore = 0) {
    loadMore -= COUNT_REPLY_REP_VIEW;
    return `<div class="reply-item" data-cmtID="${cmt.id_comment}" data-author="${cmt.user_name}.${cmt.id_user}">
                    <img src="/img/profile/${cmt.id_user}.jpg" class="rounded-circle reply-avatar" alt="${cmt.user_name}">
                    <div class="reply-wrapper">
                        <div class="reply-box">
                            <div class="reply-container">
                                <div class="reply-author">
                                    <a class="author-name" href="#">${cmt.user_name}</a>
                                    <div class="reply-date">${moment(cmt.created_time).fromNow()}</div>
                                </div>
                                <div class="reply-content" data-replyContent="${cmt.content}">
                                    ${cmt.id_user_tag ? `<span class="reply-parent-tag"><a href="# ${cmt.id_user_tag}">@${cmt.user_name_tag}</a></span>`: ''}
                                    <span class="reply-content-detail">${cmt.content.replace(new RegExp('\n', 'g'), "<br />")}</span>
                                    ${cmt.img ? `<div class="reply-image"><img src="${cmt.img.includes('.') ? '/upload/photo/' + cmt.img : 'https://drive.google.com/uc?id=' + cmt.img}"></div>` :``}
                                </div>
                            </div>
                            <div class="reply-action">
                                <div class="reply-action-left">
                                    <span class="${typeof g_user !== 'undefined' && commentLikes[cmt.id_comment] && commentLikes[cmt.id_comment].find(l => l.id_user === g_user.id_user) ? 'reply-action-liked' : 'reply-action-like' }" ${typeof g_user == 'undefined' ? ' data-toggle="modal" data-target="#loginModal"' : ''}><i class="fa fa-heart-o"></i><span class="like-count">${commentLikes[cmt.id_comment] ? commentLikes[cmt.id_comment].length : ''}</span> Thích</span>
                                    <span class="reply-action-cancel" style="display: none">Hủy</span>
                                    <span ${typeof g_user == 'undefined' ? ' data-toggle="modal" data-target="#loginModal"' : 'class="reply-action-rep"'}>Trả lời</span>
                                </div>
                                <div class="reply-action-right">
                                    <span ${typeof g_user == 'undefined' ? ' data-toggle="modal" data-target="#loginModal"' : ' class="reply-action-report"'}><i class="fa fa-flag-o"></i> Báo xấu</span>
                                    ${(typeof  g_user != 'undefined' && g_user.id_user === cmt.id_user) ? '<span class="reply-action-edit">Sửa</span><span class="reply-action-delete">Xóa</span>' : ''}
                                </div>
                            </div>
                            ${loadMore > 0 ? '<div class="load-more-reply">Xem thêm ' + loadMore + ' trả lời cũ hơn....</div>' : ''}
                            ${COMMENTS[cmt.id_comment] && COMMENTS[cmt.id_comment].length > 0 ? `<div class="reply-rep-container">${reply}</div>` : ''}
                        </div>
                    </div>
                </div>`;
}