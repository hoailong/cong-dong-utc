const helpers = require('../libs/helpers');
const tableName = 'tbl_faculty';

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
            const { faculty_name, faculty_code, created_time, created_by } = payload;
            const query = `insert into ${tableName} (faculty_name, faculty_code, created_time, created_by) values (?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [faculty_name, faculty_code, created_time, created_by], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_faculty, faculty_name, faculty_code, modified_time, modified_by } = payload;
            const query = `update ${tableName} set faculty_name = ?, faculty_code = ?, modified_time = ?, modified_by = ? where id_faculty = ?`;
            return await helpers.promisify(cb => database.query(query, [faculty_name, faculty_code, modified_time, modified_by, id_faculty], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
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
    findById: async(id_faculty) => {
        try {
            const query = `select * from ${tableName} where id_faculty=?`;
            return await helpers.promisify(cb => database.query(query, [id_faculty], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    }
};