const express = require('express');
let router = express.Router();

const auth = require('../middlewares/authMiddleware')();
const upload = require('../middlewares/uploadMiddleware');
const homeController = require('../controllers/homeController');
const documentController = require('../controllers/documentController');

router.get('/login', auth.send_authenticate());
router.get('/login/callback',  auth.authenticate(), homeController.login);
router.get('/logout' , homeController.logout);

router.use(auth.get_user);
router.get('/', homeController.index);
router.post('/upload', upload.array('files', 15), documentController.save);

module.exports = router;