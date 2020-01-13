const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

const app = express();

const router = require('./routes');

require('dotenv').config();
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

// router
app.use(router);

// app.get('/', (req, res) => {
//     console.log('home');
//     res.send('ok');
//
// });

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