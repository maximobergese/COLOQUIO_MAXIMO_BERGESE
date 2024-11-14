const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '446578392003',
        database: 'bdmbsodasoft',
    }
);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos conectada');
});

module.exports = db;
