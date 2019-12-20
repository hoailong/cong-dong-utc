const express = require('express');
let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const documentController = require('../controllers/documentController');
const facultyController = require('../controllers/facultyController');

// router.get('/login', auth.send_authenticate());
// router.get('/login/callback',  auth.authenticate(), homeController.login);
// router.get('/logout' , homeController.logout);

router.use(auth.get_user);
router.get('/', (req, res, next) => {
    res.redirect('/admin/document');
});
router.get('/document', documentController.index);
router.get('/faculty', facultyController.index);

module.exports = router;