const express = require('express');
let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const documentController = require('../controllers/documentController');
const facultyController = require('../controllers/facultyController');
const subjectController = require('../controllers/subjectController');

// router.get('/login', auth.send_authenticate());
// router.get('/login/callback',  auth.authenticate(), homeController.login);
// router.get('/logout' , homeController.logout);

router.use(auth.get_user);
router.get('/', (req, res, next) => {
    res.render('admin/home', {
        title: 'Admin Dashboard | Cộng đồng UTC',
        user: req.user,
    })
});
router.get('/document', documentController.index);
router.get('/document/verify/:id_document', documentController.verify);

router.get('/faculty', facultyController.index);
router.post('/faculty/save', facultyController.save);
router.post('/faculty/delete', facultyController.delete);

router.get('/subject', subjectController.index);
router.post('/subject/save', subjectController.save);
router.post('/subject/delete', subjectController.delete);

module.exports = router;