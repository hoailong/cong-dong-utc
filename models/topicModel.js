const helpers = require('../libs/helpers');
const tableName = 'tbl_topic';

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
            const { title, content, id_topic,  created_time, created_by } = payload;
            const query = `insert into ${tableName} (title, content, id_topic,  created_time, created_by) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [title, content, id_topic,  created_time, created_by], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_topic, topic_name, topic_code, modified_time, modified_by } = payload;
            const query = `update ${tableName} set topic_name = ?, topic_code = ?, modified_time = ?, modified_by = ? where id_topic = ?`;
            return await helpers.promisify(cb => database.query(query, [topic_name, topic_code, modified_time, modified_by, id_topic], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_topic) => {
        try {
            const query = `delete from ${tableName} where id_topic = ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_topic) => {
        try {
            const query = `select * from ${tableName} where id_topic=?`;
            return await helpers.promisify(cb => database.query(query, [id_topic], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    }
};