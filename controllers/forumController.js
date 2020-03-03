const uuid = require('uuid/v4');
const moment = require('moment');
const topicModel = require('../models/topicModel');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const forumFileModel = require('../models/forumFileModel');
const driveAPI = require('./../libs/googleDriveAPI');

module.exports = {
    index: async (req, res, next) => {
        const topics = await topicModel.all();
        res.render('forum', {
            title: 'Diễn đàn sinh viên UTC | Cộng đông UTC',
            scripts: ['client/home.js'],
            user: req.user,
            topics
        });
    },
    view: async (req, res, next) => {
        const limit = 10;
        const id = req.params['code'].split('.')[1];
        let page = parseInt(req.query['page']) || 1;
        let order = req.query['order'];
        let direction = req.query['direction'];
        const count_posts = await postModel.countPostByTopicId(id) || 0;
        const totalPage = Math.ceil(count_posts[0]['count_posts']/limit) || 0;
        page = page > totalPage && totalPage > 0 ? totalPage : page;
        const topic = await topicModel.findById(id) || [];
        const posts = await postModel.findByTopicId(id, (page-1)*limit, limit, order, direction) || [];
        res.render('forumView', {
            title: `${topic[0].topic_name} | Cộng đông UTC`,
            scripts: ['client/forum.js'],
            user: req.user,
            topic: topic[0],
            page,
            totalPage,
            order,
            direction,
            posts
        });
    },
    newPost: async (req, res, next) => {
        const topics = await topicModel.all();
        const edit_id = req.query['edit'];
        if(edit_id) {
            const post = await  postModel.findById(edit_id);
            return res.render('createPost', {
                title: 'Chỉnh sửa bài viết | Cộng đông UTC',
                scripts: ['client/createPost.js'],
                user: req.user,
                topics,
                post: post[0]
            });
        }
        const id = req.query['topic'];
        const topic = await topicModel.findById(id);
        return res.render('createPost', {
            title: 'Tạo bài viết | Cộng đông UTC',
            scripts: ['client/createPost.js'],
            user: req.user,
            topics,
            topic: topic[0]
        });
    },
    saveComment: async (req, res, next) => {
        const id_comment = req.body.id_comment;
        if (id_comment === 'undefined') {
            const created = await commentModel.create({
                id_post: req.body.id_post,
                content: req.body.content,
                id_parent: req.body.id_parent,
                id_user_tag: req.body.id_user_tag,
                user_name_tag: req.body.user_name_tag,
                img: req.files[0] ? req.files[0].filename : '',
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
                img: req.files[0] ? req.files[0].filename : '',
                modified_time: new Date(),
            });
            if (updated) {
                const comment = await commentModel.findById(id_comment);
                return res.json({status: 200, updated: 'updated', data: comment[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    getAll: async (req, res) => {
        const faculties = await topicModel.all();
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
                console.log(resp);
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
    viewPost: async (req, res, next) => {
        try{
            const id = req.params['code'].split('.')[1];
            const post = await postModel.findById(id);
            const files = await forumFileModel.findByPostId(id);
            const comments = await commentModel.findByPostId(id);
            res.render('postView', {
                title: `${post[0].title} | Cộng đông UTC`,
                scripts: ['client/home.js', 'client/post.js'],
                user: req.user,
                post: post[0],
                files,
                comments
            });
        } catch {
            res.send('loi');
        }
    },
    deletePost: async (req, res) => {
        const { id_post } = req.body ;
        const post_files = await forumFileModel.findByPostId(id_post);
        if(post_files && post_files.length > 0) {
            const deleted_drive = await driveAPI.deleteFiles(post_files.map(file => file.src));
        }
        const deleted_files = await forumFileModel.deleteByPostId(id_post);
        const deleted = await postModel.delete(id_post);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
    deleteComment: async (req, res) => {
        const { id_comment } = req.body ;
        const deleted = await commentModel.delete(id_comment);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};