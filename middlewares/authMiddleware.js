const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const helper = require('../libs/helpers');
const userModel = require('../models/userModel');

require('dotenv').config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

module.exports = function(){
    passport.use('facebookLogin', new FacebookStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
        profileFields: ['id', 'email', 'first_name', 'last_name']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const id = profile.id;
            const user = await userModel.findUserById(id);
            if(user && user.length > 0) {
                const token = await helper.generateToken(user[0], accessTokenSecret, accessTokenLife);
                return done(null, token);
            }
            else {
                const PICTURE_URL = `https://graph.facebook.com/${profile.id}/picture?width=1200&height=1200&access_token=${accessToken}`;
                const PICTURE_FOLDER = path.join(__dirname, `../public/img/profile/${id}.jpg`);
                const picture = await helper.downloadPhoto(PICTURE_URL, PICTURE_FOLDER);

                const newUser = await userModel.create({
                    id_user : id,
                    user_name: profile.name.givenName + ' ' + profile.name.familyName,
                    email: profile.emails[0].value,
                    picture: picture ? id + '.jpg' : null,
                    joined_time: new Date()
                });
                if(newUser && newUser.insertId === 0) {
                    const _user = await userModel.findUserById(id);
                    const token = await helper.generateToken(_user[0], accessTokenSecret, accessTokenLife);
                    return done(null, token);
                }
            }
        } catch(error){
            done(error, false, error.message)
        }
    }));
    return {
        initialize: () => passport.initialize(),
        send_authenticate: () => passport.authenticate('facebookLogin', {scope: ['email']}),
        authenticate: () => passport.authenticate('facebookLogin', { session: false, failureRedirect: '/' }),
        get_user: async (req, res, next) => {
            const token = req.cookies['jwt'];
            if (token) {
                try {
                    req.user = await helper.verifyToken(token, accessTokenSecret);
                    res.locals.user = req.user;
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('Not token');
            }
            next();
        }
    }
};