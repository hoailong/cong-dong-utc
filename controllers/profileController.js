const userModel = require('../models/userModel');
const followerModel = require('../models/followerModel');
const documentModel = require('../models/document/documentModel');
const postModel = require('../models/forum/postModel');

module.exports = {
    index: async (req, res, next) => {
        const id_user = req.params['id_user']|| req.user.id_user || undefined;
        const profile = await userModel.findUserDetailById(id_user);
        const posts = await postModel.findByUserId(id_user);
        const docs = await documentModel.findByUserId(id_user);
        const followers = await followerModel.findFollowerById(id_user);
        const following = await followerModel.findFollowingById(id_user);
        res.render('profile', {
            title: `${profile[0].user_name} - Cộng đông UTC`,
            scripts: ['client/home.js', 'client/profile.js'],
            user: req.user,
            profile: profile[0],
            posts,
            docs,
            followers,
            following
        });
    },
    getDocs: async (req, res) => {
        const id_user = req.params['id_user']|| req.user.id_user || undefined;
        const docs = await documentModel.findByUserId(id_user) || [];
        return res.json(docs);
    },
    getFollowers: async (req, res) => {
        const id_user = req.params['id_user']|| req.user.id_user || undefined;
        const followers = await followerModel.findFollowerById(id_user) || [];
        return res.json(followers);
    },
    getFollowings: async (req, res) => {
        const id_user = req.params['id_user']|| req.user.id_user || undefined;
        const followings = await followerModel.findFollowingById(id_user) || [];
        return res.json(followings);
    },
};