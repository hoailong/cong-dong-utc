const helpers = require('../../libs/helpers');
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
    closeComment: async(payload) => {
        try {
            const {id_post, id_user } = payload;
            const query = `update ${tableName} set allow_cmt = 0, close_cmt_by = ? where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [id_user, id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.closeComment`, message: e.sqlMessage});
            return false;
        }
    },
    allowComment: async(id_post) => {
        try {
            const query = `update ${tableName} set allow_cmt = 1 where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.closeComment`, message: e.sqlMessage});
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
            const query = `select p.*, u.user_name, u.joined_time, u.role, t.topic_name, t.topic_code, uc.user_name as close_cmt_user_name
                            from ${tableName} p 
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_user uc on p.close_cmt_by = uc.id_user
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
    getTopNewByTopicId: async(id_topic, id_post, limit = 5) => {
        try {
            const query = ` select p.*, u.user_name, f.src 
                            from ${tableName} p
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_forum_file f on p.id_post = f.id_post and f.type = 'photo'
                            where p.id_topic = ? and p.id_post != ?
                            group by p.id_post
                            order by created_time desc
                            limit ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic, id_post, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.getTopNewByTopicId`, message: e.sqlMessage});
            return false;
        }
    },
    getTopNew: async(limit = 5) => {
        try {
            const query = ` select p.*, u.user_name, f.src 
                            from ${tableName} p
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_forum_file f on p.id_post = f.id_post and f.type = 'photo'
                            group by p.id_post
                            order by created_time desc
                            limit ?`;
            return await helpers.promisify(cb => database.query(query, [limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.getTopNew`, message: e.sqlMessage});
            return false;
        }
    },
    getTopView: async(limit = 5) => {
        try {
            const query = ` select p.*, u.user_name, f.src 
                            from ${tableName} p
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_forum_file f on p.id_post = f.id_post and f.type = 'photo'
                            group by p.id_post
                            order by view desc
                            limit ?`;
            return await helpers.promisify(cb => database.query(query, [limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.getTopView`, message: e.sqlMessage});
            return false;
        }
    },
    getTopViewByTopicId: async(id_topic, limit = 5) => {
        try {
            const query = ` select p.*, u.user_name
                            from ${tableName} p
                            left join tbl_user u on p.created_by = u.id_user
                            where p.id_topic = ?
                            order by view desc
                            limit ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.getTopViewByTopicId`, message: e.sqlMessage});
            return false;
        }
    },
    getLastCommentByPostId: async(id_post, limit = 5) => {
        try {
            const query = ` select p.*, u.user_name
                            from ${tableName} p
                            left join tbl_user u on p.created_by = u.id_user
                            where p.id_topic = ?
                            order by view desc
                            limit ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.getTopViewByTopicId`, message: e.sqlMessage});
            return false;
        }
    },
    findByTopicId: async(id_topic, start = 0, limit = 10, order = "created_time", direction = "desc") => {
        try {
            const order_query = `order by ${order} ${direction} `;
            const query = `select p.*, u.user_name, count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes,
                            lc.created_time as recent_time, lc.id_user as recent_id_user, lc.user_name as recent_user_name
                            from ${tableName} p 
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_forum_comment c on p.id_post = c.id_post
                            left join tbl_forum_like l on p.id_post = l.id_post
                            left join (
                                select DISTINCT cc.created_time, cc.id_post, cc.id_user, u.user_name
                                from tbl_forum_comment cc
                                inner join tbl_user u on cc.id_user = u.id_user
                                order by cc.created_time desc ) as lc on p.id_post = lc.id_post
                            where id_topic = ?
                            group by p.id_post
                            ${order_query}
                            limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [id_topic, start, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByTopicId`, message: e.sqlMessage});
            return false;
        }
    },
    findByUserId: async(id_user, start = 0, limit = 10) => {
        try {
            const query = `select p.*, u.user_name, count(distinct c.id_comment) as count_comments, count(distinct l.id_user) as count_likes
                            from ${tableName} p 
                            left join tbl_user u on p.created_by = u.id_user
                            left join tbl_forum_comment c on p.id_post = c.id_post
                            left join tbl_forum_like l on p.id_post = l.id_post
                            where p.created_by = ?
                            group by p.id_post
                            order by p.created_time desc
                            limit ?, ?`;
            return await helpers.promisify(cb => database.query(query, [id_user, start, limit], cb));
        } catch(e) {
            console.log({function: `${tableName}.findByUserId`, message: e.sqlMessage});
            return false;
        }
    },
    updateView: async(id_post) => {
        try {
            const query = `update ${tableName} set view = view + 1 where id_post = ?`;
            return await helpers.promisify(cb => database.query(query, [id_post], cb));
        } catch(e) {
            console.log({function: `${tableName}.updateView`, message: e.sqlMessage});
            return false;
        }
    },
};