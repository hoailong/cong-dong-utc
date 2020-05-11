const helpers = require('../../libs/helpers');
const tableName = 'tbl_doc_like';

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
            const { id_doc, id_user, created_time } = payload;
            const query = `insert into ${tableName} (id_doc, id_user, created_time) values (?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_doc, id_user, created_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(payload) => {
        try {
            const { id_doc, id_user } = payload;
            const query = `delete from ${tableName} where id_doc = ? and id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc, id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    deleteByDocId: async(id_doc) => {
        try {
            const query = `delete from ${tableName} where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.deleteByDocId`, message: e.sqlMessage});
            return false;
        }
    },
    findByDocId: async(id_doc) => {
        try {
            const query = `select * from ${tableName}
                            where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByDocId`, message: e.sqlMessage});
            return false;
        }
    }
};