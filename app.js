const express = require('express');
const app = express();

app.use(express.urlencoded({extend:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + 'public'));

console.log(__dirname);

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
const { connect } = require('./database/db');
const connection = require('./database/db');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

require('./database/db');

//Rutas
    app.get('/', (req, res) => {
        res.render('index');
    })

    app.get('/login', (req, res) => {
        res.render('login');
    })

    app.get('/register', (req, res) => {
        res.render('register');
    })


    
    //Register
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO user SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Usuario Registrado",
                alertMessage: "proceso exitoso",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''

            })
         }
    }) 
})
    //Auth

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.send('User y/o Pass incorrecto');
            }else{
                res.send('Bienvenido');
            }
        })
    }

})

app.listen(3000, (req, res) => {
    console.log('Servidor ejecutandose in http://localhost:3000');
});
