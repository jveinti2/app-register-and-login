const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    passwd: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//Manejador de errores
connection.connect((error)=>{
    if(error){
        console.log('El error es :' + error);
        return;
    }
    console.log('conectado a la BD');
});

//Configuración de la app
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
const { resolveInclude } = require('ejs');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

require('./database/db');

//RUTAS
    //home
    app.get('/', (req, res) => {
        res.render('index');
    })
    //login programadora Cx
    app.get('/loginCx', (req, res) => {
        res.render('loginCx');
    })
    //Dashboard programadora Cx
    app.get('/dashboardCx', (req, res) => {
        res.render('dashboardCx')
    })
    //Dashboard VigilanciaEp
    app.get('/dashboardVig', (req, res) => {
        res.render('dashboardVig')
    })


    //login Vigilancia epidemiologica
    app.get('/loginVig', (req, res) => {
        res.render('loginVig');
    })

    //login Central esterilización
    app.get('/loginCen', (req, res) => {
        res.render('loginCen');
    })

    //RegisterCx
    app.get('/register', (req, res) => {
        res.render('register');
    })
    //RegisterVig
    app.get('/registerVig', (req, res) => {
        res.render('registerVig');
    })

//METODOS REGISTER  
    //Register Cx
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
    //Register Vig
app.post('/registerVig', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO user2 SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async (error, results) => {
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

//METODOS AUTH
    //Auth Cx
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM user WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('loginCx',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password incorrecto",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer:false,
                    ruta:'loginCx'
                });
            }else{
                req.session.name = results[0].name
                res.render('loginCx',{
                    alert: true,
                    alertTitle: "Bienvenido",
                    alertMessage: "login correcto",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer:1500,
                    ruta:'dashboardCx'
                });
            }
        })
    }
})

    //Auth VigilanciaEp
app.post('/auth2', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM user2 WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('loginVig',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o password incorrecto",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer:false,
                    ruta:'loginVig'
                });
            }else{
                req.session.name = results[0].name
                res.render('loginCx',{
                    alert: true,
                    alertTitle: "Bienvenido",
                    alertMessage: "login correcto",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer:1500,
                    ruta:'dashboardVig'
                });
            }
        })
    }
})


//LISTEN PORT APP
    //listen
app.listen(3000, (req, res) => {
    console.log('Servidor ejecutandose in http://localhost:3000');
});
