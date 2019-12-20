const facultyModel = require('../models/facultyModel');
const subjectModel = require('../models/subjectModel');

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
        res.render('home', {
            title: 'Home',
            user: req.user,
            faculties,
            subjects
        });
    },
    uploadDoc: async (req, res, next) => {
        res.json('ok');
    },
};