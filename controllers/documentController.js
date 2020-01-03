const uuid = require('uuid/v4');
const moment = require('moment');

const documentModel = require('../models/documentModel');
const docPhotoModel = require('../models/docPhotoModel');
const docFileModel = require('../models/docFileModel');

module.exports = {
    index: async (req, res, next) => {
        const docs = await documentModel.all();

        res.render('admin/document', {
            title: 'Quản lý tai lieu | Cộng đồng UTC',
            user: req.user,
            moment: moment,
            scripts: ['document.js'],
            docs
        })
    },
    getAll: async (req, res) => {
        const docs = await documentModel.all();
        return res.json(docs);
    },
    save: async (req, res) => {
        const id_doc = req.body.id_doc;
        const { id_faculty, id_subject, id_year, privacy, type, note } = req.body;
        if (!id_doc) {
            const id = type + '-' + uuid();
            const created = await documentModel.create({
                id_doc: id,
                id_user: req.user.id_user,
                id_faculty, id_subject, id_year, privacy, type, note,
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
                id_faculty, id_subject, id_year, privacy, type, note,
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
        const verified = await documentModel.varify(id_document);
        if (verified) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const id_document = req.body.id_document;
        const deleted = await documentModel.delete(id_document);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};