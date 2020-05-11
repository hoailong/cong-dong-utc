const helpers = require('../../libs/helpers');
const tableName = 'tbl_subject';


module.exports = {
    all: async() => {
        try {
            const query = `select s.*, count(d.id_subject) as doc_count
                        from ${tableName} s left join tbl_document d on d.id_subject = s.id_subject and d.status = 1
                        group by s.id_subject
                        order by s.subject_name `;
            return await helpers.promisify(cb => database.query(query, cb));
        } catch(e) {
            console.log({function: `${tableName}.all`, message: e.sqlMessage});
            return false;
        }
    },
    getByPage: async(from, count) => {
        try {
            const query = `select s.id_subject, s.subject_name, count(d.id_subject) as doc_count
                            from ${tableName} s left join tbl_document d on d.id_subject = s.id_subject and d.status = 1
                            group by s.id_subject
                            order by s.subject_name limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [from, count], cb));
        } catch(e) {
            console.log({function: `${tableName}.all`, message: e.sqlMessage});
            return false;
        }
    },
    create: async(payload) => {
        try {
            const { subject_name, subject_code, subject_slug, created_time, created_by } = payload;
            const query = `insert into ${tableName} (subject_name, subject_code, subject_slug, created_time, created_by) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [subject_name, subject_code, subject_slug, created_time, created_by], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_subject, subject_name, subject_code, subject_slug, modified_time, modified_by } = payload;
            const query = `update ${tableName} set subject_name = ?, subject_code = ?, subject_slug = ?, modified_time = ?, modified_by = ? where id_subject = ?`;
            return await helpers.promisify(cb => database.query(query, [subject_name, subject_code, subject_slug, modified_time, modified_by, id_subject], cb));
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