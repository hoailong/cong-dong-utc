const helpers = require('../../libs/helpers');
const tableName = 'tbl_document';

module.exports = {
    all: async() => {
        try {
            // const query = `select * from ${tableName}`;
            const query = `select d.*, u.user_name, f.faculty_name, s.subject_name, y.year_name from ${tableName} d 
                        left join tbl_user u on d.id_user = u.id_user
                        left join tbl_faculty f on d.id_faculty = f.id_faculty
                        left join tbl_subject s on d.id_subject =  s.id_subject
                        left join tbl_year y on d.id_year = y.id_year
                        order by d.created_time desc`;
            return await helpers.promisify(cb => database.query(query, cb));
        } catch(e) {
            console.log({function: `${tableName}.all`, message: e.sqlMessage});
            return false;
        }
    },
    create: async(payload) => {
        try {
            const { id_doc, title, id_user, id_faculty, id_subject, id_year, privacy, type, note, created_time } = payload;
            const query = `insert into ${tableName} (id_doc, title, id_user, id_faculty, id_subject, id_year, privacy, type, note, created_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_doc, title, id_user, id_faculty, id_subject, id_year, privacy, type, note, created_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_doc, title, id_faculty, id_subject, id_year, privacy, type, note, modified_time } = payload;
            const query = `update ${tableName} set title = ? id_subject = ?, id_faculty = ?, id_year = ?, privacy = ?, type = ?, note = ?, modified_by = ? where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [title, id_subject, id_faculty, id_year, privacy, type, note, modified_time, id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    updateView: async(id_doc) => {
        try {
            const query = `update ${tableName} set view = view + 1 where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.updateView`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_doc) => {
        try {
            const query = `select d.*, u.user_name, f.faculty_name, s.subject_name, s.subject_slug, y.year_name from ${tableName} d
                            left join tbl_user u on d.id_user = u.id_user
                            left join tbl_faculty f on d.id_faculty = f.id_faculty
                            left join tbl_subject s on d.id_subject =  s.id_subject
                            left join tbl_year y on d.id_year = y.id_year
                            where d.id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    },
    findBySubjectId: async(id_subject) => {
        try {
            const query = `select d.*, u.user_name, f.faculty_name, s.subject_name, y.year_name, 
                            count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes
                            from ${tableName} d
                            left join tbl_user u on d.id_user = u.id_user
                            left join tbl_faculty f on d.id_faculty = f.id_faculty
                            left join tbl_subject s on d.id_subject =  s.id_subject
                            left join tbl_year y on d.id_year = y.id_year
                            left join tbl_doc_comment c on d.id_doc = c.id_doc
                            left join tbl_doc_like l on d.id_doc = l.id_doc
                            where d.id_subject = ? and status = 1
                            group by d.id_doc
                            order by d.created_time desc`;
            return await helpers.promisify(cb => database.query(query, [id_subject], cb));
        } catch(e) {
            console.log({function: `${tableName}.findBySubjectId`, message: e.sqlMessage});
            return false;
        }
    },
    findBySubjectIdByQuery: async(id_subject, start = 0, limit = 10, order = 'd.created_time desc') => {
        try {
            const orderQuery = `order by ${order}`;
            const query = `select d.*, u.user_name, f.faculty_name, s.subject_name, y.year_name, 
                            count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes
                            from ${tableName} d
                            left join tbl_user u on d.id_user = u.id_user
                            left join tbl_faculty f on d.id_faculty = f.id_faculty
                            left join tbl_subject s on d.id_subject =  s.id_subject
                            left join tbl_year y on d.id_year = y.id_year
                            left join tbl_doc_comment c on d.id_doc = c.id_doc
                            left join tbl_doc_like l on d.id_doc = l.id_doc
                            where d.id_subject = ? and status = 1
                            group by d.id_doc
                            ${orderQuery}
                            limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [id_subject, start, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.findBySubjectIdByPage`, message: e.sqlMessage});
            return false;
        }
    },
    findByUserId: async(id_user, start = 0, limt = 10) => {
        try {
            const query = `select d.*, u.user_name,s.subject_name, y.year_name, 
                            count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes
                            from ${tableName} d
                            left join tbl_user u on d.id_user = u.id_user
                            left join tbl_subject s on d.id_subject =  s.id_subject
                            left join tbl_year y on d.id_year = y.id_year
                            left join tbl_doc_comment c on d.id_doc = c.id_doc
                            left join tbl_doc_like l on d.id_doc = l.id_doc
                            where d.id_user = ? and status = 1
                            group by d.id_doc
                            order by d.created_time desc
                            limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [id_user, start, limt], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByUserId`, message: e.sqlMessage});
            return false;
        }
    },
    verify: async(payload) => {
        try {
            const {id_doc, verified_time, verified_by} = payload;
            const query = `update ${tableName} set status = 1, verified_time = ?, verified_by = ?  where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [verified_time, verified_by, id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(payload) => {
        try {
            const {id_doc, deleted_time, deleted_by} = payload;
            const query = `update ${tableName} set status = -1, deleted_time = ?, deleted_by = ?  where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [deleted_time, deleted_by, id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    confirmDelete: async(id_doc) => {
        try {
            const query = `delete from ${tableName} where id_doc = ?`;
            return await helpers.promisify(cb => database.query(query, [id_doc], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    count: async() => {
        try {
            const query = `select  count(*) as count from ${tableName};`;
            return await helpers.promisify(cb => database.query(query, [], cb));
        } catch(e) {
            console.log({function: `${tableName}.count`, message: e.sqlMessage});
            return false;
        }
    },
};