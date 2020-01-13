const uuid = require('uuid/v4');
const moment = require('moment');

const documentModel = require('../models/documentModel');
const facultyModel = require('../models/facultyModel');
const subjectModel = require('../models/subjectModel');
const yearModel = require('../models/yearModel');

module.exports = {
    index: async (req, res, next) => {
        const faculties = await subjectModel.all();

        res.render('admin/subject', {
            title: 'Quản lý môn học | Cộng đồng UTC',
            user: req.user,
            scripts: ['subject.js'],
            faculties
        })
    },
    view: async (req, res, next) => {
        const { id } = req.params;
        const subject = await subjectModel.findById(id);
        const docs = await documentModel.findBySubjectId(id);
        const faculties = await facultyModel.all();
        const subjects = await subjectModel.all();
        const years = await yearModel.all();

        res.render('listdoc', {
            title: `Tài liệu môn ${subject[0].subject_name} | Cộng đồng UTC`,
            user: req.user,
            moment: moment,
            // scripts: ['subject.js'],
            subject: subject[0],
            faculties,
            subjects,
            years,
            docs
        })
    },
    getAll: async (req, res) => {
        const faculties = await subjectModel.all();
    },
    getByPage: async (req, res) => {
        const from = parseInt(req.params['from']);
        const count = parseInt(req.params['count']);
        const faculties = await subjectModel.getByPage(from, count) || [];
        return res.json(faculties);
    },
    save: async (req, res) => {
        const id_subject = req.body.id_subject;
        if (!id_subject) {
            const created = await subjectModel.create({
                subject_name: req.body.subject_name,
                subject_code: req.body.subject_code,
                created_time: new Date(),
                created_by: req.user.id_user
            });
            if (created && created.insertId) {
                const subject = await subjectModel.findById(created.insertId);
                return res.json({status: 200, created: 'created', data: subject[0]});
            }
        } else {
            const updated = await subjectModel.update({
                id_subject: req.body.id_subject,
                subject_name: req.body.subject_name,
                subject_code: req.body.subject_code,
                modified_time: new Date(),
                modified_by: req.user.id_user
            });
            if (updated) {
                const subject = await subjectModel.findById(id_subject);
                return res.json({status: 200, updated: 'updated', data: subject[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const id_subject = req.body.id_subject;
        const deleted = await subjectModel.delete(id_subject);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};