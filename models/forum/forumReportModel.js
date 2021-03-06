const helpers = require('../../libs/helpers');
const tableName = 'tbl_forum_report';

module.exports = {
    all: async() => {
        try {
            const query = `select * from ${tableName}`;
            return await helpers.promisify(cb => database.query(query, cb));
        } catch(e) {
            console.log({function: `${tableName}.all`, message: e.sqlMessage});
            return false;
        }
    },
    create: async(payload) => {
        try {
            const { id_post, id_comment, id_user, type, content, created_time } = payload;
            const query = `insert into ${tableName} (id_post, id_comment, id_user, type, content, created_time) values (?, ?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_post, id_comment, id_user, type, content, created_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(payload) => {
        try {
            const { id_post, id_user } = payload;
            const query = `delete from ${tableName} where id_post = ? and id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [id_post, id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    }
};