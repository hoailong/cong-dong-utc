const express = require('express');
let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const upload = require('../middlewares/uploadMiddleware');
const homeController = require('../controllers/homeController');
const documentController = require('../controllers/documentController');
const subjectController = require('../controllers/subjectController');

router.get('/login', auth.send_authenticate());
router.get('/login/callback',  auth.authenticate(), homeController.login);
router.get('/logout' , homeController.logout);

router.use(auth.get_user);
router.get('/', homeController.index);
router.get('/bg', (req, res) => res.render('bg'));
router.post('/upload', upload.array('files', 15), documentController.save);
router.get('/subject/:from/:count', subjectController.getByPage);


router.get('/s/:id', subjectController.view);
router.get('/d/:id_doc', documentController.view);
module.exports = router;