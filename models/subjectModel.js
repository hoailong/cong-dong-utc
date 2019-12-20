const helpers = require('../libs/helpers');
const tableName = 'tbl_subject';

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
            const { id_subject, subject_name, created_time, created_by } = payload;
            const query = `insert into ${tableName} (id_subject, subject_name, created_time, created_by) values (?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_subject, subject_name, created_time, created_by], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_subject, subject_name, modified_time, modified_by } = payload;
            const query = `update ${tableName} set subject_name = ?, modified_time = ?, modified_by = ? where id_subject = ?`;
            return await helpers.promisify(cb => database.query(query, [subject_name, modified_time, modified_by, id_subject], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_subject) => {
        try {
            const query = `delete from ${tableName} where id_subject = ?`;
            return await helpers.promisify(cb => database.query(query, [id_subject], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_subject) => {
        try {
            const query = `select * from ${tableName} where id_subject=?`;
            return await helpers.promisify(cb => database.query(query, [id_subject], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    }
};