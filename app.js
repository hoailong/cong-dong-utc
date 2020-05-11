const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

const app = express();

const router = require('./routes');

require('dotenv').config();
require('moment/locale/vi');
require('./database');

// view engine set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(favicon(path.join(__dirname, 'public', '/img/ninja-coder.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const ggDriver = require('./libs/googleDriveAPI');
// app.get('/gg', ggDriver.getToken);
// ggDriver.listFiles();
// ggDriver.createFolder('CNTT1', );
// ggDriver.createFolder('2nth2', ['1rj63ehV3WeSGHhlPyLyBQbu71XI8WTT-']);
// ggDriver.setPublicFolder('1tC7XZ1lqYg3pCsUxKTbFQOcIpxG5ejwK');
// ggDriver.setPublicFolder('1rn-0-eL6bTzf0jSTuD23XKppc1rywM2s');
// ggDriver.setPublicFolder('1FzZzG6DesNoBoarHFj6nD1n5ufOJ6WWh');
// ggDriver.setPublicFolder('1h-yrBnjYdxQ1jDm5sWEVxN5VHgO80S7Z');
// ggDriver.deleteFile('1y1XTRMwLv3HQhvOIwNV9S8GNtprIYWko');
// ggDriver.storeFile('test.jpg', );
// ggDriver.emptyTrash();

// const tinify = require("tinify");
// tinify.key = process.env.tinifyKey;
// const source = tinify.fromFile("test.jpg");
// source.toFile("optimized.jpg");
// router
app.use(router);

// catch 404 and forwarding to error handle
app.use((req, res, next) => {
    const err = new Error('NOt Found');
    err.status = 404;
    next(err);
});

// error handle 
// development error handler
// will print stracktrace
if(app.get('env') === 'development'){
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;