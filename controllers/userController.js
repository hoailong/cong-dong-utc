const uuid = require('uuid/v4');
const moment = require('moment');
const userModel = require('../models/userModel');

module.exports = {
    index: async (req, res, next) => {
        const users = await userModel.all();

        res.render('admin/user', {
            title: 'Quản lý tài khoản | Cộng đồng UTC',
            user: req.user,
            scripts: ['admin/user.js'],
            moment,
            users
        })
    },
    getAll: async (req, res) => {
        const users = await userModel.all();
    },
    save: async (req, res) => {
        const id_user = req.body.id_user;
        if (!id_user) {
            const created = await userModel.create({
                user_name: req.body.user_name,
                email: req.body.email,
                role: req.body.role,
                joined_time: new Date(),
            });
            if (created && created.insertId) {
                const user = await userModel.findById(created.insertId);
                return res.json({status: 200, created: 'created', data: user[0]});
            }
        } else {
            const updated = await userModel.update({
                id_user: req.body.id_user,
                user_name: req.body.user_name,
                email: req.body.email,
                role: req.body.role,
                modified_time: new Date(),
                modified_by: req.user.id_user
            });
            if (updated) {
                const user = await userModel.findUserById(id_user);
                return res.json({status: 200, updated: 'updated', data: user[0]});
            }
        }
        return res.json({status: 403, message: 'Error'});
    },
    delete: async (req, res) => {
        const id_user = req.body.id_user;
        const deleted = await userModel.delete(id_user);
        if (deleted) {
            return res.json({status: 200});
        }
        return res.json({status: 403, message: 'Error'});
    }
};