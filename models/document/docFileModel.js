const helpers = require('../../libs/helpers');
const tableName = 'tbl_doc_file';

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
            const { id_doc, src, id_folder, filename, type } = payload;
            const query = `insert into ${tableName} (id_doc, src, id_folder, filename, type) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_doc, src, id_folder, filename, type], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_faculty) => {
        try {
            const query = `delete from ${tableName} where id_faculty = ?`;
            return await helpers.promisify(cb => database.query(query, [id_faculty], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    deleteByDocId: async(id_doc) => {
        try {
            const query = `delete from ${tableName} where id_doc=?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.deleteByDocId`, message: e.sqlMessage});
            return false;
        }
    },
    findByDocId: async(id_doc) => {
        try {
            const query = `select * from ${tableName} where id_doc=?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByPostId`, message: e.sqlMessage});
            return false;
        }
    }
};