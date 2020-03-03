const helpers = require('../libs/helpers');
const tableName = 'tbl_contact';

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
            const { contact_name, contact_email, contact_phone, contact_content, created_time } = payload;
            const query = `insert into ${tableName} (contact_name, contact_email, contact_phone, contact_content, created_time) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [contact_name, contact_email, contact_phone, contact_content, created_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_contact) => {
        try {
            const query = `select * from ${tableName} where id_contact=?`;
            return await helpers.promisify(cb => database.query(query, [id_contact], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    }
};