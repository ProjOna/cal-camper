const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'daw_user',
  password: 'P@ssw0rd',
  database: 'camper_app'
});

connection.connect(err => {
  if (err) {
    console.error('Error conexión:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = connection;