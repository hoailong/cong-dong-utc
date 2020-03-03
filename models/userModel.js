const helpers = require('../libs/helpers');
const tableName = 'tbl_user';

module.exports = {
    all: async() => {
        try {
            const query = `select * from ${tableName}`;
            return await helpers.promisify(cb => database.query(query, cb));
        } catch(e) {
            console.log({function: 'User.all', message: e.sqlMessage});
            return false;
        }
    },
    create: async(payload) => {
        try {
            const { id_user, user_name, email, picture, joined_time } = payload;
            const query = `insert into ${tableName} (id_user, user_name, email, picture, joined_time) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_user, user_name, email, picture, joined_time], cb));
        } catch(e) {
            console.log({function: 'User.create', message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_user, user_name, email, role, modified_time, modified_by } = payload;
            const query = `update ${tableName} set user_name = ?, email = ?, role = ?, modified_time = ?, modified_by = ? where id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [user_name, email, role, modified_time, modified_by, id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    findUserById: async(id_user) => {
        try {
            const query = `select * from ${tableName} where id_user=?`;
            return await helpers.promisify(cb => database.query(query, [id_user], cb));
        } catch(e) {
            console.log({function: 'User.All', message: e.sqlMessage});
            return false;
        }
    }
};