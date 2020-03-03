const facultyModel = require('../models/facultyModel');
const subjectModel = require('../models/subjectModel');
const yearModel = require('../models/yearModel');
const documentModel = require('../models/documentModel');
const topicModel = require('../models/topicModel');

module.exports = {
    login: async (req, res) => {
        res.cookie('jwt', req.user);
        res.redirect('/');
    },
    logout: async (req, res, next) => {
        res.clearCookie("jwt");
        res.redirect('/');
    },
    index: async (req, res, next) => {
        const faculties = await facultyModel.all();
        const subjects = await subjectModel.all();
        const subjects_page1 = await subjectModel.getByPage(0, 20);
        const years = await yearModel.all();
        const count_doc = await documentModel.count();
        res.render('home', {
            title: 'Tổng kho tài liệu - đề thi | Cộng đông UTC',
            scripts: ['client/home.js'],
            user: req.user,
            faculties,
            subjects,
            subjects_page1,
            years,
            count_doc: count_doc[0].count
        });
    },
    contact: async (req, res, next) => {
        const faculties = await facultyModel.all();
        const subjects = await subjectModel.all();
        const subjects_page1 = await subjectModel.getByPage(0, 20);
        const years = await yearModel.all();
        res.render('contact', {
            title: 'Liên hệ - Góp ý | Cộng đông UTC',
            scripts: ['client/home.js'],
            user: req.user,
            faculties,
            subjects,
            subjects_page1,
            years
        });
    },
    forum: async (req, res, next) => {
        const topics = await topicModel.all();
        res.render('forum', {
            title: 'Diễn đàn sinh viên UTC | Cộng đông UTC',
            scripts: ['client/home.js'],
            user: req.user,
            topics
        });
    },
    uploadDoc: async (req, res, next) => {
        res.json('ok');
    },
};