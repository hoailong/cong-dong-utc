const express = require('express');
let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const documentController = require('../controllers/documentController');
const facultyController = require('../controllers/facultyController');
const subjectController = require('../controllers/subjectController');
const userController = require('../controllers/userController');

router.use(auth.get_user, (req, res, next) => {
    if(req.user) {
        if (req.user.role !== 'USER') {
            next();
        } else {
            res.status(403).json('Bạn chưa được cấp quyền!');
        }
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res, next) => {
    res.render('admin/home', {
        title: 'Admin Dashboard | Cộng đồng UTC',
        user: req.user,
    })
});
router.get('/document', documentController.index);
router.get('/document/verify/:id_document', documentController.verify);
router.get('/document/delete/:id_document', documentController.delete);
router.get('/document/view/:id_document', documentController.getById);

router.get('/faculty', facultyController.index);
router.post('/faculty/save', facultyController.save);
router.post('/faculty/delete', facultyController.delete);

router.get('/subject', subjectController.index);
router.post('/subject/save', subjectController.save);
router.post('/subject/delete', subjectController.delete);

router.get('/user', userController.index);
router.post('/user/save', userController.save);
router.post('/user/delete', userController.delete);

module.exports = router;