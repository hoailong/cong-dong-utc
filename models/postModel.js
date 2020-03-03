const helpers = require('../libs/helpers');
const tableName = 'tbl_post';

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
            const { title, code, content, id_topic,  created_time, created_by } = payload;
            const query = `insert into ${tableName} (title, code, content, id_topic,  created_time, created_by) values (?, ?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [title, code, content, id_topic,  created_time, created_by], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_post,  title, code, content, id_topic, modified_time, modified_by } = payload;
            const query = `update ${tableName} set title = ?, code = ?,  content = ?,  id_topic = ?, modified_time = ?, modified_by = ? where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [title, code, content, id_topic, modified_time, modified_by, id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(id_post) => {
        try {
            const query = `delete from ${tableName} where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findById: async(id_post) => {
        try {
            const query = `select p.*, u.user_name, t.topic_name, t.topic_code
                            from ${tableName} p 
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_topic t on p.id_topic = t.id_topic
                            where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.findById`, message: e.sqlMessage});
            return false;
        }
    },
    countPostByTopicId: async(id_topic) => {
        try {
            const query = `select count(*) as count_posts
                            from ${tableName}
                            where id_topic = ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByTopicId`, message: e.sqlMessage});
            return false;
        }
    },
    findByTopicId: async(id_topic, start = 0, limit = 10, order = "created_time", direction = "desc") => {
        try {
            const order_query = `order by ${order} ${direction} `;
            const query = `select p.*, u.user_name, count(c.id_comment) as count_comments
                            from ${tableName} p 
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_comment c on p.id_post = c.id_post
                            where id_topic = ?
                            group by p.id_post
                            ${order_query}
                            limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic, start, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByTopicId`, message: e.sqlMessage});
            return false;
        }
    }
};