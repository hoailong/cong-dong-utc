let posts = g_post;
let docs;
let followers;
let followings;
let currentTab = 'posts';
let id_profile;
$(document).ready(function(){
    id_profile = $('#id_profile').val();
   $('.tab').click(async function(){
        const tab = $(this).attr('data-tab');
        if(tab !== currentTab) {
            $('.profile-tabs li').removeClass('active');
            $(`.profile-tabs li a[data-tab='${tab}']`).parent().addClass('active');
            currentTab = tab;
            switch(tab) {
                case 'posts' :
                    loadTabContent('', '.post-feed');break;
                case 'docs' :
                    if(!docs) {
                        docs = await fetch(`/u/${id_profile}/docs`);
                        docs = await docs.json();
                        loadTabContent(showDocs(docs), '.doc-feed');
                    }
                    loadTabContent('', '.doc-feed');break;
                case 'followers' :
                    if(!followers) {
                        followers = await fetch(`/u/${id_profile}/followers`);
                        followers = await followers.json();
                        loadTabContent(showFollowers(followers), '.folower-feed');
                    }
                    loadTabContent('', '.folower-feed');break;
                case 'followings' :
                    if(!followings) {
                        followings = await fetch(`/u/${id_profile}/followings`);
                        followings = await followings.json();
                        loadTabContent(showFollowers(followings), '.folowing-feed');
                    }
                    loadTabContent('', '.folower-feed');break;
                default: console.log('err');
            }
        }
   })
});

function loadTabContent(code, classShow){
    $('.user-activities ul').hide();
    $('.user-activities').find(classShow).append(code).show();
}

function showPosts(posts) {
    let code = ``;
    posts.forEach(post => {
        code+= `
            <li class="post-feed-item">
                <a href="/#">
                <img src="/img/profile/${ post.created_by }.jpg" class="rounded-circle" alt="Hoài Long" width="45px">
                </a>
                <div class="post-feed-item-info">
                    <div class="post-feed-meta">
                        <a href="/u/${ post.created_by }">${ post.user_name }</a> -
                        <span class="text-muted">${ moment.duration( (new Date()).getTime() - moment(post.created_time).toDate().getTime(), 'milliseconds')._data.hours >= 1 ?
                                                                    moment(post.created_time).calendar() : moment(post.created_time).fromNow() }
                        </span>
                    </div>
                    <div class="post-feed-title"><a href="/forum/p/${ post.code }.${ post.id_post }">${ post.title }</a></div>
                    <div class="post-feed-statistics">
                        <span title="Binh luận: ${ post.count_comments}">${ post.count_comments } <i class="fa fa-comment-o">&nbsp;</i></span>
                        <span title="Yêu thích: ${ post.count_likes}">${ post.count_likes } <i class="fa fa-heart-o">&nbsp;</i></span>
                        <span title="Lượt xem: ${ post.view}">${ post.view } <i class="fa fa-eye"></i></span>
                    </div>
                </div>
            </li>`
    });
    if(posts.length === 0) code = `<p class="text-center">Chưa đăng bài viết nào.</p>`;
    return code;
}

function showDocs(docs) {
    let code = ``;
    docs.forEach(doc => {
        code+= `
            <li class="post-feed-item">
                <a href="/#">
                    <img src="/img/profile/${ doc.id_user }.jpg" class="rounded-circle" alt="${ doc.user_name }" width="45px">
                </a>
                <div class="post-feed-item-info">
                    <div class="post-feed-meta"><a href="/u/${ doc.id_user }">${ doc.user_name }</a> -
                        <span class="text-muted">${ moment.duration( (new Date()).getTime() - moment(doc.created_time).toDate().getTime(), 'milliseconds')._data.hours >= 1 ?
                                    moment(doc.created_time).calendar() : moment(doc.created_time).fromNow() }
                    </span>
                    </div>
                    <div class="post-feed-title"><a href="/docs/d/${ doc.id_doc }">${ doc.title  || 'Không tiêu đề'} - ${ doc.subject_name}</a></div>
                    <div class="post-feed-statistics">
                        <span title="Binh luận: ${ doc.count_comments}">${ doc.count_comments } <i class="fa fa-comment-o">&nbsp;</i></span>
                        <span title="Yêu thích: ${ doc.count_likes}">${ doc.count_likes } <i class="fa fa-heart-o">&nbsp;</i></span>
                        <span title="Lượt xem: ${ doc.view}">${ doc.view } <i class="fa fa-eye"></i></span>
                    </div>
                </div>
            </li>`
    });
    if(docs.length === 0) code = `<p class="text-center">Chưa đóng góp tài liệu nào.</p>`;
    return code;
}

function showFollowers(followers) {
    let code = ``;
    followers.forEach(doc => {
        code+= `
            <li class="follower-item col-sm-6 col-md-4 d-flex">
                <a href="/#">
                    <img src="/img/profile/1004317903236309.jpg" class="rounded-circle" alt="Hoài Long" width="80px">
                </a>
                <div class="follower-item-info ml-3">
                    <div>
                        <div class="font-weight-bold"><a href="/#">Hoài Long</a></div>
                        <div class="text-muted">
                            <i class="fa fa-user-plus"></i> 11
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-radius btn btn-outline-success mt-2"><i class="fa fa-feed"></i> Theo dõi</button>
                    </div>
                </div>
            </li>`
    });
    if(followers.length === 0) code = `<p style="text-align: center;width: 100%;">Không hề có ai theo dõi :v</p>`;
    return code;
}