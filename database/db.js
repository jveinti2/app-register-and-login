// //Metodo para la conexión con la BD
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     passwd: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// //Manejador de errores
// connection.connect((error)=>{
//     if(error){
//         console.log('El error es :' + error);
//         return;
//     }
//     console.log('conectado a la BD');
// });

module.exports = connection;