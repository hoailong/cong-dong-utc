const contactModel = require('../models/contactModel');

module.exports = {
    index: async (req, res, next) => {
        const years = await contactModel.all();
        res.render('admin/year', {
            title: 'Quản lý năm | Cộng đồng UTC',
            user: req.user,
            scripts: ['year.js'],
            years
        })
    },
    getAll: async (req, res) => {
        const years = await contactModel.all();
    },
    save: async (req, res) => {
        const { contact_name, contact_email, contact_phone, contact_content, created_time } = req.body;
        const created = await contactModel.create({
            contact_name,
            contact_email,
            contact_phone,
            contact_content,
            created_time: new Date()
        });
        if (created && created.insertId) {
            return res.json({status: 200, created: 'created'});
        }
        return res.json({status: 403, message: 'Error'});
    }
};