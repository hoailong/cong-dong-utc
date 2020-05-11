const express = require('express');
const moment = require('moment');

let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const uploadLocal = require('../middlewares/uploadMiddleware');
const uploadDriver = require('../middlewares/uploadDriverMiddleware');
const homeController = require('../controllers/homeController');
const profileController = require('../controllers/profileController');
const documentController = require('../controllers/documentController');
const subjectController = require('../controllers/subjectController');
const forumController = require('../controllers/forumController');
const contactController = require('../controllers/contactController');

//common respon
router.use( (req, res, next) => {
    res.locals = {
        moment
    };
    next();
});

router.get('/login', auth.send_authenticate());
router.get('/login/callback',  auth.authenticate(), homeController.login);
router.get('/logout' , homeController.logout);

//common
router.use(auth.get_user);
router.get('/', homeController.index);
router.get('/contact', homeController.contact);
router.post('/contact', contactController.save);
router.get('/bg', (req, res) => res.render('bg'));

//profile
router.get('/u/:id_user', profileController.index);
router.get('/u/:id_user/docs', profileController.getDocs);
router.get('/u/:id_user/followers', profileController.getFollowers);
router.get('/u/:id_user/followings', profileController.getFollowings);

router.post('/docs/d/:id_subject', documentController.getByQuery);
//post required user login
router.post('*', auth.required_login);

//forum
router.get('/forum', forumController.index);
router.get('/forum/post', auth.required_login, forumController.newPost);
router.post('/forum/post', uploadDriver.array('files', 10), forumController.savePost);
router.post('/forum/delete-post', forumController.deletePost);
router.post('/forum/close-comment', forumController.closeComment);
router.post('/forum/allow-comment', forumController.allowComment);
router.get('/forum/p/:code', forumController.viewPost);
router.get('/forum/:code', forumController.view);
router.post('/forum/comment', uploadDriver.array('files', 1), forumController.saveComment);
router.post('/forum/delete-comment', forumController.deleteComment);
router.post('/forum/like', forumController.like);
router.post('/forum/unlike', forumController.unlike);
router.post('/forum/like-comment', forumController.likeComment);
router.post('/forum/unlike-comment', forumController.unlikeComment);
router.post('/forum/report', forumController.report);

//docs
router.get('/docs', homeController.index);
router.post('/docs/upload', uploadDriver.array('files', 15), documentController.save);
router.get('/docs/s/:from/:count', subjectController.getByPage);
router.get('/docs/s/:code', subjectController.view);
router.get('/docs/d/:id_doc', documentController.view);
router.post('/docs/comment', uploadDriver.array('files', 1), documentController.saveComment);
router.post('/docs/delete-comment', documentController.deleteComment);
router.post('/docs/like', documentController.like);
router.post('/docs/unlike', documentController.unlike);
router.post('/docs/like-comment', documentController.likeComment);
router.post('/docs/unlike-comment', documentController.unlikeComment);


module.exports = router;