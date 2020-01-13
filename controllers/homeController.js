const facultyModel = require('../models/facultyModel');
const subjectModel = require('../models/subjectModel');
const yearModel = require('../models/yearModel');
const documentModel = require('../models/documentModel');

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
        console.log('index');
        const faculties = await facultyModel.all();
        const subjects = await subjectModel.all();
        const subjects_page1 = await subjectModel.getByPage(0, 20);
        const years = await yearModel.all();
        const count_doc = await documentModel.count();
        res.render('home', {
            title: 'Home',
            user: req.user,
            faculties,
            subjects,
            subjects_page1,
            years,
            count_doc: count_doc[0].count
        });
    },
    uploadDoc: async (req, res, next) => {
        res.json('ok');
    },
};