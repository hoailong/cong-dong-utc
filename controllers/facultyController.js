const uuid = require('uuid/v4');
const facultyModel = require('../models/facultyModel');

module.exports = {
    index: async (req, res, next) => {
        const faculties = await facultyModel.all();

        res.render('admin/faculty', {
            title: 'Quản lý khoa | Cộng đồng UTC',
            user: req.user,
            scripts: ['faculty.js'],
            faculties
        })
    },
    getAll: async (req, res) => {
        const faculties = await facultyModel.all();
    },
    save: async (req, res) => {
        const id_faculty = req.body.id_faculty;
        if (!id_faculty) {
            const id = uuid();
            const created = await facultyModel.create({
                id_faculty: id,
                faculty_name: req.body.faculty_name,
                created_time: new Date(),
                created_by: req.user.id_user
            });
            if (created) {
                const faculty = await facultyModel.findById(id);
                return res.json({status: 200, created: 'created', data: faculty[0]});
            }
        } else {
            const updated = await facultyModel.update({
                id_faculty: id_faculty,
                faculty_name: req.body.faculty_name,
                modified_time: new Date(),
                modified_by: req.user.id_user
            });
            if (updated) {
                const faculty = await facultyModel.findById(id_faculty);
                return res.json({status: 200, updated: 'updated', data: faculty[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const id_faculty = req.body.id_faculty;
        const deleted = await facultyModel.delete(id_faculty);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};