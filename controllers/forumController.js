const userModel = require('../models/userModel');
const topicModel = require('../models/forum/topicModel');
const postModel = require('../models/forum/postModel');
const commentModel = require('../models/forum/forumCommentModel');
const reportModel = require('../models/forum/forumReportModel');
const likeModel = require('../models/forum/forumLikeModel');
const commentLikeModel = require('../models/forum/forumCommentLikeModel');
const forumFileModel = require('../models/forum/forumFileModel');
const driveAPI = require('./../libs/googleDriveAPI');

module.exports = {
    //topic

    index: async (req, res, next) => {
        const topics = await topicModel.allInfo();
        const topHot = await postModel.getTopView(5) || [];
        const topNew = await postModel.getTopNew(5) || [];
        res.render('forum2', {
            title: 'Diễn đàn sinh viên UTC - Cộng đông UTC',
            scripts: ['client/home.js'],
            user: req.user,
            topics,
            topNew
        });
    },
    view: async (req, res, next) => {
        const limit = 15;
        const id = req.params['code'].split('.')[1];
        let page = parseInt(req.query['page']) || 1;
        let order = req.query['order'];
        let direction = req.query['direction'];
        const count_posts = await postModel.countPostByTopicId(id) || 0;
        const totalPage = Math.ceil(count_posts[0]['count_posts']/limit) || 0;
        page = page > totalPage && totalPage > 0 ? totalPage : page;
        const topic = await topicModel.findById(id) || [];
        const posts = await postModel.findByTopicId(id, (page-1)*limit, limit, order, direction) || [];
        const topHot = await postModel.getTopView(5) || [];
        res.render('forumView', {
            title: `${topic[0].topic_name} - Cộng đông UTC`,
            scripts: ['client/forum.js'],
            user: req.user,
            topic: topic[0],
            page,
            totalPage,
            order,
            direction,
            posts,
            topHot
        });
    },
    getAll: async (req, res) => {
        const faculties = await topicModel.all();
    },

    //post

    newPost: async (req, res, next) => {
        const topics = await topicModel.all();
        const edit_id = req.query['edit'];
        if(edit_id) {
            const post = await  postModel.findById(edit_id);
            return res.render('createPost', {
                title: 'Chỉnh sửa bài viết - Cộng đông UTC',
                scripts: ['client/createPost.js'],
                user: req.user,
                topics,
                post: post[0]
            });
        }
        const id = req.query['topic'];
        const topic = await topicModel.findById(id);
        return res.render('createPost', {
            title: 'Tạo bài viết - Cộng đông UTC',
            scripts: ['client/createPost.js'],
            user: req.user,
            topics,
            topic: topic[0]
        });
    },
    viewPost: async (req, res, next) => {
        try{
            const id = req.params['code'].split('.')[1];
            const post = await postModel.findById(id) || [];
            const author = await userModel.findUserDetailForumById(post[0].created_by) || [];
            const files = await forumFileModel.findByPostId(id) || [];
            const comments = await commentModel.findByPostId(id) || [];
            const commentLikes = await commentLikeModel.findByPostId(id) || [];
            const likes = await likeModel.findByPostId(id) || [];
            const topNew = await postModel.getTopNewByTopicId(post[0].id_topic, id, 4) || [];
            const topHot = await postModel.getTopView(5) || [];
            await postModel.updateView(id);
            res.render('postView', {
                title: `${post[0].title} - Cộng đông UTC`,
                scripts: ['client/post.js'],
                user: req.user,
                post: post[0],
                author: author[0],
                files,
                topNew,
                topHot,
                likes,
                comments,
                commentLikes
            });
        } catch {
            res.send('loi');
        }
    },
    savePost: async (req, res) => {
        const {id_post} = req.body;
        if(id_post === '') {
            const created = await postModel.create({
                title: req.body.title,
                code: req.body.code,
                content: req.body.content,
                id_topic: req.body.id_topic,
                created_time: new Date(),
                created_by: req.user.id_user
            });
            if (created && created.insertId) {
                let resp = await Promise.all(
                    req.files.map(async file => {
                        return await forumFileModel.create({ id_post: created.insertId, src: file.src, id_folder: file.id_folder, filename: file.filename, type: file.type })
                    })
                );
                const post = await postModel.findById(created.insertId);
                return res.json({status: 200, created: 'created', data: post[0]});
            }
        } else {
            const updated = await postModel.update({
                id_post,
                title: req.body.title,
                code: req.body.code,
                content: req.body.content,
                id_topic: req.body.id_topic,
                modified_time: new Date(),
                modified_by: req.user.id_user
            });
            if (updated) {
                let resp = await Promise.all(
                    req.files.map(async file => {
                        return await forumFileModel.create({ id_post: id_post, src: file.src, id_folder: file.id_folder, filename: file.filename, type: file.type })
                    })
                );
                console.log(resp);
                const post = await postModel.findById(id_post);
                return res.json({status: 200, created: 'created', data: post[0]});
            }

        }
        return res.json({status: 403, message: 'Error'});
    },
    closeComment: async (req, res) => {
        const updated = await postModel.closeComment({
            id_post: req.body.id_post,
            id_user: req.user.id_user
        });
        if (updated) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
    allowComment: async (req, res) => {
        const { id_post } = req.body ;
        const updated = await postModel.allowComment(id_post);
        if (updated) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
    deletePost: async (req, res) => {
        const { id_post } = req.body ;
        const post_files = await forumFileModel.findByPostId(id_post);
        if(post_files && post_files.length > 0) {
            const deleted_drive = await driveAPI.deleteFiles(post_files.map(file => file.src));
        }
        const deleted_files = await forumFileModel.deleteByPostId(id_post);
        const deleted_comments = await commentModel.deleteByPostId(id_post);
        const deleted_likes = await likeModel.deleteByPostId(id_post);
        const deleted_comment_likes = await commentLikeModel.deleteByPostId(id_post);
        const deleted = await postModel.delete(id_post);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },

    //comment

    saveComment: async (req, res, next) => {
        const id_comment = req.body.id_comment;
        if (id_comment === 'undefined') {
            const created = await commentModel.create({
                id_post: req.body.id_post,
                content: req.body.content,
                id_parent: req.body.id_parent,
                id_user_tag: req.body.id_user_tag,
                user_name_tag: req.body.user_name_tag,
                img: req.files[0] ? req.files[0].src : '',
                id_user: req.user.id_user,
                created_time: new Date(),
            });
            if (created && created.insertId) {
                const comment = await commentModel.findById(created.insertId);
                return res.json({status: 200, created: 'created', data: comment[0]});
            }
        } else {
            const updated = await commentModel.update({
                id_comment,
                content: req.body.content,
                img_deleted: req.body.img_deleted,
                img: req.files[0] ? req.files[0].src : '',
                modified_time: new Date(),
            });
            if (updated) {
                const comment = await commentModel.findById(id_comment);
                return res.json({status: 200, updated: 'updated', data: comment[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    deleteComment: async (req, res) => {
        const { id_comment } = req.body ;
        const deleted_comment_likes = await commentLikeModel.deleteByCommentId(id_comment);
        const deleted_child_comment_likes = await commentLikeModel.deleteByParentCommentId(id_comment);
        const deleted = await commentModel.delete(id_comment);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },

    //like

    like: async (req, res, next) => {
        const created = await likeModel.create({
            id_post: req.body.id_post,
            id_user: req.user.id_user,
            created_time: new Date(),
        });
        if (created) {
            return res.json({status: 200});
        } else {
            return res.json({status: 403, message: 'Error'});
        }
    },
    unlike: async (req, res) => {
        const deleted = await likeModel.delete({
            id_post: req.body.id_post,
            id_user: req.user.id_user
        });
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
    likeComment: async (req, res, next) => {
        const created = await commentLikeModel.create({
            id_comment: req.body.id_comment,
            id_post: req.body.id_post,
            id_user: req.user.id_user,
            created_time: new Date(),
        });
        if (created) {
            return res.json({status: 200});
        } else {
            return res.json({status: 403, message: 'Error'});
        }
    },
    unlikeComment: async (req, res) => {
        const deleted = await commentLikeModel.delete({
            id_comment: req.body.id_comment,
            id_user: req.user.id_user
        });
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },

    // report
    report: async (req, res) => {
        const created = await reportModel.create({
            id_post: req.body.postrpID,
            id_comment: req.body.commentrpID,
            content: req.body.reportContent,
            type: req.body.reportType,
            id_user: req.user.id_user,
            created_time: new Date(),
        });
        if (created) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
};