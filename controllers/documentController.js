const uuid = require('uuid/v4');
const moment = require('moment');

const documentModel = require('../models/document/documentModel');
const facultyModel = require('../models/document/facultyModel');
const subjectModel = require('../models/document/subjectModel');
const yearModel = require('../models/document/yearModel');
const docPhotoModel = require('../models/document/docPhotoModel');
const docFileModel = require('../models/document/docFileModel');
const commentModel = require('../models/document/docCommentModel');
const likeModel = require('../models/document/docLikeModel');
const commentLikeModel = require('../models/document/docCommentLikeModel');

module.exports = {
    index: async (req, res, next) => {
        const docs = await documentModel.all();

        res.render('admin/document', {
            title: 'Quản lý tài liệu | Cộng đồng UTC',
            user: req.user,
            moment: moment,
            scripts: ['admin/document.js'],
            docs
        })
    },
    view: async (req, res, next) => {
        const { id_doc } = req.params;
        const doc = await documentModel.findById(id_doc) || [];
        const files = await  docFileModel.findByDocId(id_doc) || [];
        const faculties = await facultyModel.all() || [];
        const subjects = await subjectModel.all() || [];
        const years = await yearModel.all() || [];
        const comments = await commentModel.findByDocId(id_doc) || [];
        const commentLikes = await commentLikeModel.findByDocId(id_doc) || [];
        const likes = await likeModel.findByDocId(id_doc) || [];
        await documentModel.updateView(id_doc);

        res.render('docView', {
            title: `${doc[0].title || 'Không tiêu đề'} - ${doc[0].subject_name} | Cộng đồng UTC`,
            user: req.user,
            moment: moment,
            scripts: ['client/docs.js', 'client/docview.js'],
            doc: doc[0],
            faculties,
            subjects,
            years,
            files,
            comments,
            likes,
            commentLikes
        })
    },
    getAll: async (req, res) => {
        const docs = await documentModel.all();
        return res.json(docs);
    },
    getByQuery: async (req, res) => {
        const id_subject = req.params['id_subject'];
        const {start, limit, order} = req.body;
        const docs = await documentModel.findBySubjectIdByQuery(id_subject, start, limit, order) || [];
        return res.json(docs);
    },
    getById: async (req, res) => {
        const { id_document } = req.params;
        try {
            const doc_files = await docFileModel.findByDocId(id_document);
            const photo_files = await docPhotoModel.findByDocId(id_document);
            const files = [...photo_files, ...doc_files];
            return res.status(200).json(files);
        } catch (e) {
            return res.status(404);
        }
    },
    save: async (req, res) => {
        const id_doc = req.body.id_doc;
        const { title, id_faculty, id_subject, id_year, privacy, type, note } = req.body;
        if (!id_doc) {
            const id = type + '-' + uuid();
            const created = await documentModel.create({
                id_doc: id,
                id_user: req.user.id_user,
                id_faculty, id_subject, id_year, privacy, type, note, title,
                created_time: new Date(),
            });
            if (created) {
                // let resp = await Promise.all(
                //     files.map(async file => {
                //         if(file.type === 'photo') {
                //             return await docPhotoModel.create({ id_doc: id, filename: file.filename })
                //         } else {
                //             return await docFileModel.create({ id_doc: id, filename: file.filename })
                //         }
                //     })
                // );
                // console.log(resp);
                let resp = await Promise.all(
                    req.files.map(async file => {
                        return await docFileModel.create({ id_doc: id, src: file.src, id_folder: file.id_folder, filename: file.filename, type: file.type })
                    })
                );
                console.log(resp);
                const document = await documentModel.findById(id);
                return res.json({status: 200, created: 'created', data: document[0]});
            }
        } else {
            const updated = await documentModel.update({
                id_document: id_doc,
                d_user: req.user.id_user,
                id_faculty, id_subject, id_year, privacy, type, note, title,
                modified_time: new Date(),
            });
            if (updated) {
                const document = await documentModel.findById(id_document);
                return res.json({status: 200, updated: 'updated', data: document[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    verify : async (req, res) => {
        const {id_document} = req.params;
        // const photos = [];
        // const resp = await Promise.all(
        //     photos.map(async file => {
        //         return await docPhotoModel.create({ id_doc: id, filename: file.filename })
        //     })
        // );
        // console.log(resp);
        const verified = await documentModel.verify({
            id_doc: id_document,
            verified_time: new Date(),
            verified_by: req.user.id_user
        });
        if (verified) {
            // return res.json({status: 200});
            return res.redirect('/admin/document');
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const {id_document} = req.params;
        let deleted;
        if(req.user.role === 'ADMIN') {
            deleted = await documentModel.confirmDelete(id_document);
        } else {
            deleted = await documentModel.delete({
                id_doc: id_document,
                deleted_time: new Date(),
                deleted_by: req.user.id_user
            });
        }
        if (deleted) {
            // return res.json({status: 200});
            return res.redirect('/admin/document');
        }
        return res.json({status: 403, message: 'Error'});
    },

    //comment

    saveComment: async (req, res, next) => {
        const id_comment = req.body.id_comment;
        if (id_comment === 'undefined') {
            const created = await commentModel.create({
                id_doc: req.body.id_doc,
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
            id_doc: req.body.id_doc,
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
            id_doc: req.body.id_doc,
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
            id_doc: req.body.id_doc,
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

};