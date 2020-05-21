const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.admin', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'passwd',
  passReqToCallback: true
}, async (req, correo, passwd, done) => {
  const rol="admin";
  const rows = await pool.query('SELECT * FROM usuarios WHERE rol= ? AND correo = ?', [rol,correo]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(passwd, user.passwd)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido! '));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El correo no existe.'));
  }
  
}));
passport.use('local.cliente', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'passwd',
  passReqToCallback: true
}, async (req, correo, passwd, done) => {
  const rol="cliente";
  const rows = await pool.query('SELECT * FROM usuarios WHERE rol= ? AND correo = ?', [rol,correo]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(passwd, user.passwd)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido!'));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El correo no existe.'));
  }
  
}));


passport.use('local.registro', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'passwd',
  passReqToCallback: true
}, async (req, correo, passwd, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  if (rows.length > 0) {
    done(null, false, req.flash('message', 'La cuenta ya existe.'));
   
  }else {
    const rol = "cliente";
    const id="NULL";
    const newUser = {
      id,
      correo,
      passwd,
      rol
    };
   
    newUser.passwd = await helpers.encryptPassword(passwd);
    // Saving in the Database
    const result = await pool.query('INSERT INTO usuarios SET ? ', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
  }
  
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});