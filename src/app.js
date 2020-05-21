const express = require('express');
const path = require('path');//crear el path para poder utilizar el app.set('views', path.join(__dirname, 'views'));
const morgan = require('morgan');
const mysql = require('mysql');
const session= require('express-session');
const myConnection = require('express-myconnection');
const multer = require('multer');      
const passport = require('passport');
const validator = require('express-validator');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


   
const { database } = require('./keys');

 const storage= multer.diskStorage({
   destination: path.join(__dirname, 'public/imagenes'),
  filename:(req,file,cb) =>{
    cb(null,file.originalname);
  }
});

// Intializations
const app = express();
require('./lib/passport');



// importing routes
const IndexRoutes = require('./routes/index');

// settings
app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'pelis_app',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());



app.use(multer({
  storage,
  dest: path.join(__dirname, 'public/imagenes')
}).single('imagen'));


// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});


// routes
app.use('/', IndexRoutes);


// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
  console.log(`Corriendo en el puerto ${app.get('port')}`);
});
