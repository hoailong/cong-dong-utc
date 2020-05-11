const helpers = require('../libs/helpers');
const tableName = 'tbl_user';

module.exports = {
    all: async() => {
        try {
            const query = `select * from ${tableName}`;
            return await helpers.promisify(cb => database.query(query, cb));
        } catch(e) {
            console.log({function: 'User.all', message: e.sqlMessage});
            return false;
        }
    },
    create: async(payload) => {
        try {
            const { id_user, user_name, email, picture, joined_time } = payload;
            const query = `insert into ${tableName} (id_user, user_name, email, picture, joined_time) values (?, ?, ?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_user, user_name, email, picture, joined_time], cb));
        } catch(e) {
            console.log({function: 'User.create', message: e.sqlMessage});
            return false;
        }
    },
    update: async(payload) => {
        try {
            const { id_user, user_name, email, role, modified_time, modified_by } = payload;
            const query = `update ${tableName} set user_name = ?, email = ?, role = ?, modified_time = ?, modified_by = ? where id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [user_name, email, role, modified_time, modified_by, id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.update`, message: e.sqlMessage});
            return false;
        }
    },
    findUserById: async(id_user) => {
        try {
            const query = `select * from ${tableName} where id_user=?`;
            return await helpers.promisify(cb => database.query(query, [id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.findUserById`, message: e.sqlMessage});
            return false;
        }
    },
    findUserDetailById: async(id_user) => {
        try {
            const query = `select u.*, count(DISTINCT p.id_post) as count_posts, count(DISTINCT d.id_doc) as count_docs,
                            count(DISTINCT fer.id_follower) as  count_followers, count(DISTINCT fing.id_user) as  count_followings
                            from ${tableName} u 
                            left join tbl_post p on u.id_user = p.created_by
                            left join tbl_document d on u.id_user = d.id_user
                            left join tbl_follower fer on u.id_user = fer.id_follower
                            left join tbl_follower fing on u.id_user = fing.id_user
                            where u.id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.findUserDetailById`, message: e.sqlMessage});
            return false;
        }
    },
    findUserDetailForumById: async(id_user) => {
        try {
            const query = `select u.*, count( p.id_post) as count_posts, l.count_likes, c.count_cmts, count(f.id_user) as count_followers
                            from ${tableName} u
                            left join tbl_post p on p.created_by = u.id_user
                            left join (select p.created_by as created_by, count(l.id_post) as count_likes
                                        from tbl_forum_like l
                                        left join tbl_post p on l.id_post = p.id_post
                                        group by p.created_by) l on l.created_by = u.id_user
                            left join (select p.created_by as created_by, count(c.id_post) as count_cmts
                                        from tbl_forum_comment c
                                        left join tbl_post p on c.id_post = p.id_post
                                        group by p.created_by) c on c.created_by = u.id_user
                            left join tbl_follower f on f.id_follower = u.id_user
                            where u.id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.findUserDetailForumById`, message: e.sqlMessage});
            return false;
        }
    }

};