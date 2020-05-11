const helpers = require('../../libs/helpers');
const tableName = 'tbl_year';

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
            const { year_name } = payload;
            const query = `insert into ${tableName} (year_name) values (?)`;
            return await helpers.promisify(cb => database.query(query, [year_name], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_year, year_name } = payload;
            const query = `update ${tableName} set year_name = ? where id_year = ?`;
            return await helpers.promisify(cb => database.query(query, [year_name, id_year], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_year) => {
        try {
            const query = `delete from ${tableName} where id_year = ?`;
            return await helpers.promisify(cb => database.query(query, [id_year], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_year) => {
        try {
            const query = `select * from ${id_year} where id_year=?`;
            return await helpers.promisify(cb => database.query(query, [id_year], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    }
};