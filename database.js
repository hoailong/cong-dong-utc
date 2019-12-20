const mysql = require('mysql');

const config = require('./config');

const connection = mysql.createConnection(config.mysql);

connection.connect(err => {
    if(err) {
        console.error('Error connecting mysql: ' + err.stack);
        return
    }

    console.log('Connect mysql as id ' + connection.threadId);
});

global.database = connection;