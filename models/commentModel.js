const helpers = require('../libs/helpers');
const tableName = 'tbl_comment';

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
            const { id_post, content, id_user, id_parent, id_user_tag, user_name_tag, img, created_time } = payload;
            const query = `insert into ${tableName} (id_post, content, id_user, id_parent, id_user_tag, img, user_name_tag, created_time) values (?, ?, ?, ?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_post, content, id_user, id_parent, id_user_tag, img, user_name_tag, created_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_comment, content, img, img_deleted, modified_time, } = payload;
            if(img_deleted === 'false' && img === '') {
                const query = `update ${tableName} set content = ?, modified_time = ? where id_comment = ?`;
                return await helpers.promisify(cb => database.query(query, [content, modified_time, id_comment], cb));
            } else {
                const query = `update ${tableName} set content = ?, img =?, modified_time = ? where id_comment = ?`;
                return await helpers.promisify(cb => database.query(query, [content, img, modified_time, id_comment], cb));
            }
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_comment) => {
        try {
            const query = `delete from ${tableName} where id_comment = ? or id_parent = ?`;
            return await helpers.promisify(cb => database.query(query, [id_comment, id_comment], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_comment) => {
        try {
            const query = `select c.*, u.user_name
                            from ${tableName} c left join tbl_user u on c.id_user = u.id_user
                            where id_comment = ?`;
            return await helpers.promisify(cb => database.query(query, [id_comment], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    },
    findByPostId: async(id_post) => {
        try {
            const query = `select c.*, u.user_name
                            from ${tableName} c left join tbl_user u on c.id_user = u.id_user
                            where id_post = ?
                            order by created_time desc`;
            return await helpers.promisify(cb => database.query(query, [id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByPostId`, message: e.sqlMessage});
            return false;
        }
    }
};