const uuid = require('uuid/v4');
const moment = require('moment');

const documentModel = require('../models/documentModel');
const facultyModel = require('../models/facultyModel');
const subjectModel = require('../models/subjectModel');
const yearModel = require('../models/yearModel');
const docPhotoModel = require('../models/docPhotoModel');
const docFileModel = require('../models/docFileModel');

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
        await documentModel.updateView(id_doc);
        const doc = await documentModel.findById(id_doc);
        const doc_files = await docFileModel.findByDocId(id_doc);
        const photo_files = await docPhotoModel.findByDocId(id_doc);
        const files = [...photo_files, ...doc_files];
        const faculties = await facultyModel.all();
        const subjects = await subjectModel.all();
        const years = await yearModel.all();

        res.render('listfile', {
            title: `${doc[0].title || 'Không tiêu đề'} - ${doc[0].subject_name} | Cộng đồng UTC`,
            user: req.user,
            moment: moment,
            // scripts: ['document.js'],
            doc: doc[0],
            faculties,
            subjects,
            years,
            files
        })
    },
    getAll: async (req, res) => {
        const docs = await documentModel.all();
        return res.json(docs);
    },
    getByPage: async (req, res) => {
        const from = parseInt(req.params['from']);
        const count = parseInt(req.params['count']);
        const id_subject = req.params['id_subject'];
        const docs = await documentModel.findBySubjectIdByPage(id_subject, from, count) || [];
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
            let files = req.files.map(file => {
                return {
                    filename: file.filename,
                    type: file.mimetype.startsWith('image/') ? 'photo' : 'file'
                }
            });
            if (created) {
                let resp = await Promise.all(
                    files.map(async file => {
                        if(file.type === 'photo') {
                            return await docPhotoModel.create({ id_doc: id, filename: file.filename })
                        } else {
                            return await docFileModel.create({ id_doc: id, filename: file.filename })
                        }
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
    }
};