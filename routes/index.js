const express = require('express');
const router = express.Router();

const homeRouter = require('./homeRouter');
const adminRouter = require('./adminRouter');

router.use('/', homeRouter);
router.use('/admin', adminRouter);

module.exports = router;