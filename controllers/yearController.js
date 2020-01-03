const yearModel = require('../models/yearModel');

module.exports = {
    index: async (req, res, next) => {
        const years = await yearModel.all();

        res.render('admin/year', {
            title: 'Quản lý năm | Cộng đồng UTC',
            user: req.user,
            scripts: ['year.js'],
            years
        })
    },
    getAll: async (req, res) => {
        const years = await yearModel.all();
    },
    save: async (req, res) => {
        const id_year = req.body.id_year;
        if (!id_year) {
            const created = await yearModel.create({
                year_name: req.body.year_name,
            });
            if (created && created.insertId) {
                const year = await yearModel.findById(created.insertId);
                return res.json({status: 200, created: 'created', data: year[0]});
            }
        } else {
            const updated = await yearModel.update({
                id_year: req.body.id_year,
                year_name: req.body.year_name
            });
            if (updated) {
                const year = await yearModel.findById(id_year);
                return res.json({status: 200, updated: 'updated', data: year[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const id_year = req.body.id_year;
        const deleted = await yearModel.delete(id_year);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};