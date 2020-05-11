const helpers = require('../libs/helpers');
const tableName = 'tbl_follower';

module.exports = {
    create: async(payload) => {
        try {
            const { id_user, id_follower, followed_time } = payload;
            const query = `insert into ${tableName} (id_user, id_follower, followed_time) values (?, ?, ?)`;
            return await helpers.promisify(cb => database.query(query, [id_user, id_follower, followed_time], cb));
        } catch(e) {
            console.log({function: `${tableName}.create`, message: e.sqlMessage});
            return false;
        }
    },
    delete: async(payload) => {
        try {
            const { id_user, id_follower } = payload;
            const query = `delete from ${tableName} where id_user = ? and id_follower = ?`;
            return await helpers.promisify(cb => database.query(query, [id_user, id_follower], cb));
        } catch(e) {
            console.log({function: `${tableName}.delete`, message: e.sqlMessage});
            return false;
        }
    },
    findFollowingById: async(id_user) => {
        try {
            const query = `select * from ${tableName} where id_user = ?`;
            return await helpers.promisify(cb => database.query(query, [id_user], cb));
        } catch(e) {
            console.log({function: `${tableName}.findFollowingById`, message: e.sqlMessage});
            return false;
        }
    },
    findFollowerById: async(id_follower) => {
        try {
            const query = `select * from ${tableName} where id_follower = ?`;
            return await helpers.promisify(cb => database.query(query, [id_follower], cb));
        } catch(e) {
            console.log({function: `${tableName}.findFollowerById`, message: e.sqlMessage});
            return false;
        }
    }
};