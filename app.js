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

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})


app.listen(3000, (req, res) => {
    console.log('Servidor ejecutandose in http://localhost:3000');
});

//Register
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO user SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async (err, result) => {
        if(error){
            console.log('Error');
        }else{
            res.send('User registrado')
        }
    }) 
})

