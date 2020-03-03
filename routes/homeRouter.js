const express = require('express');
const moment = require('moment');

let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const upload = require('../middlewares/uploadMiddleware');
const uploadDriver = require('../middlewares/uploadDriverMiddleware');
const homeController = require('../controllers/homeController');
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
router.post('/upload', upload.array('files', 15), documentController.save);

//forum
router.get('/forum', homeController.forum);
router.get('/forum/post', forumController.newPost);
// router.post('/forum/post', upload.none(), forumController.savePost);
router.post('/forum/post', uploadDriver.array('files', 10), forumController.savePost);
router.post('/forum/delete-post', forumController.deletePost);
router.get('/forum/p/:code', forumController.viewPost);
router.get('/forum/:code', forumController.view);
router.post('/forum/comment', upload.array('files', 1), forumController.saveComment);
router.post('/forum/delete-comment', forumController.deleteComment);

//docs
router.get('/docs', homeController.index);
router.get('/docs/s/:from/:count', subjectController.getByPage);
router.get('/docs/d/:id_subject/:from/:count', documentController.getByPage);
router.get('/docs/s/:id', subjectController.view);
router.get('/docs/d/:id_doc', documentController.view);


module.exports = router;