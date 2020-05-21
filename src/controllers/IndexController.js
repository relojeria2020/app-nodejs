const controller = {};
const pool = require('../database');
const passport = require('passport');
const stripe= require('stripe')('sk_test_wJcIWcHUlMePLzlqrWANGSGP00efXgYpdY');

controller.pago= async (req,res)=>{
  const {pago,nombre,descripcion}=req.body;
  const id= req.user.id;
 const sql= await pool.query("SELECT id_producto,cantidad FROM carrito WHERE id_usuario=?",[id]);

 const customer= await stripe.customers.create({
  email: req.body.stripeEmail,
  source: req.body.stripeToken
    
  });
  
  const charge= await stripe.charges.create({
    amount: pago+'00',
    currency: 'mxn',
    customer: customer.id ,
    description: 'tienda online Relojeria'
  });
  const token_pago=charge.id;
  const id_usuario=id;
  const newCompra={
    nombre,
    descripcion,
    pago,
    token_pago,
    id_usuario
  };
  var cantidad=[100];
  var con=0;
  for(let s=0; s<sql.length;)
  {
    con++;
   cantidad[s]= await query.log("SELECT id AS 'id_producto',cantidad FROM productos  WHERE id=?",[sql[s].id_producto]);
  }
  for(let c=0; c<con; c++){
     console.log(cantidad[c]);
  }
  const compra = await pool.query('INSERT INTO pedidos set ?',[newCompra]);

  res.redirect("/cliente/carrito"); 
 

};
controller.index= async(req,res) =>{
  const producto=await pool.query("SELECT * FROM productos");
res.render("index",{producto});
};
controller.datos_cliente= async(req,res) =>{
  
  const id_usuario=req.user.id;
  const datos_envio= await pool.query("SELECT * FROM datos WHERE id_usuario=?",[id_usuario]);
    const precio = await pool.query('SELECT precio FROM carrito WHERE id_usuario=?',[id_usuario]);
    const cantidad = await pool.query('SELECT cantidad FROM carrito WHERE id_usuario=?',[id_usuario]);
    var cont=0;
    for(let i=0; i<precio.length; i++ ){
     cont++; 
    }
  
    var articulos=0;
    for(let a=0; a<cont; a++)
    {
      articulos+=cantidad[a].cantidad;                       
    }
  res.render("datos_cliente",{articulos,datos_envio});
};
controller.datos_cliente_actualizar= async(req,res) =>{
  const id_usuario=req.user.id;
  const {nombre,paterno,materno,colonia,primera_calle,segunda_calle,numero,descripcion}=req.body;
  const datos={
  nombre,
  paterno,
  materno,
  colonia,
  primera_calle,
  segunda_calle,
  numero,
  descripcion
  };
  pool.query("UPDATE datos SET ? WHERE id_usuario=?",[datos,id_usuario]);
  res.redirect("/cliente/datos/envio");
};
controller.datos_cliente_registro= async(req,res) =>{
  const id_usuario=req.user.id;
const {nombre,paterno,materno,colonia,primera_calle,segunda_calle,numero,descripcion}=req.body;
const datos={
nombre,
paterno,
materno,
colonia,
primera_calle,
segunda_calle,
numero,
descripcion,
id_usuario
};
pool.query("INSERT INTO datos SET ?",[datos]);
res.redirect("/cliente/datos/envio");
};
controller.inicio=(req,res) =>{
    res.render("inicio_sesion");
};
controller.contacto=(req,res)=>{
res.render("contacto");
};
controller.registrarse=(req,res)=>{
res.render("registro");
};
controller.suscribirse= async(req,res)=>{
const correo =req.body;
await pool.query('INSERT INTO suscritos SET ?',[correo]);
res.redirect("/");
};
controller.auth = async (req, res, next) => {  
  const {correo} = req.body;
  const cliente="cliente";
  const admin="admin";
  const error="";
 
  const sql = await pool.query('SELECT rol FROM usuarios WHERE correo = ? ',[correo]);

  if(error==sql || admin==sql[0].rol){  
    
    passport.authenticate('local.admin', {      
      successRedirect: '/administrador/inicio',
      failureRedirect:'/inicio/sesion', 
      failureFlash: true
    })(req, res, next);
  }
  if(error==sql || cliente==sql[0].rol){

    passport.authenticate('local.cliente', {
      successRedirect: '/cliente/inicio',      
      failureRedirect:'/inicio/sesion',  
      failureFlash: true
    })(req, res, next);
    }
};
controller.cliente_inicio= async(req,res)=>{
  const id=req.user.id;
  const carrito = await pool.query('SELECT id, nombre,descripcion,precio,cantidad,imagen FROM carrito WHERE id_usuario=?',[id]);
  const precio = await pool.query('SELECT precio FROM carrito WHERE id_usuario=?',[id]);
  const cantidad = await pool.query('SELECT cantidad FROM carrito WHERE id_usuario=?',[id]);
  var cont=0;
  for(let i=0; i<precio.length; i++ ){
   cont++; 
  }

  var articulos=0;
  for(let a=0; a<cont; a++)
  {
    articulos+=cantidad[a].cantidad;                       
  }
const productos=await pool.query("SELECT * FROM productos");
res.render("inicio_cliente",{productos,articulos});
};
controller.cliente_carrito= async(req,res)=>{
  const id=req.user.id;
  const carrito = await pool.query('SELECT id, nombre,descripcion,precio,cantidad,imagen FROM carrito WHERE id_usuario=?',[id]);
  const precio = await pool.query('SELECT precio FROM carrito WHERE id_usuario=?',[id]);
  const cantidad = await pool.query('SELECT cantidad FROM carrito WHERE id_usuario=?',[id]);
  const sql = await pool.query('SELECT nombre FROM carrito WHERE id_usuario=?',[id]);
  const sqls = await pool.query('SELECT descripcion FROM carrito WHERE id_usuario=?',[id]);
  var cont=0;
  for(let i=0; i<precio.length; i++ ){
   cont++; 
  }

  var total = 0;
  var articulos=0;
  var arti=[100];
  var des=[100];
  for(let a=0; a<cont; a++)
  {
    total+=precio[a].precio * cantidad[a].cantidad; 
    articulos+=cantidad[a].cantidad;                       
  }
 
  for(let b=0; b<cont; b++){
     arti[b]=sql[b].nombre;
     des[b]=sqls[b].descripcion;
  }
  if(total=="")
  {
    console.log("tu pago es de 0");
  }else{
    var pago=total+150;
  }
 
  res.render("carrito_cliente",{carrito,total,articulos,pago,arti,des});
};
controller.registro = (req, res, next) => {  
    passport.authenticate('local.registro', {
      successRedirect: '/administrador/inicio',      
      failureRedirect:'/inicio/sesion',  
      failureFlash: true
    })(req, res, next);
};
controller.cerrar = (req, res) => {
    req.logOut();
    req.flash('success', 'Sesión cerrada con exito.');
    res.redirect('/');
    };

    controller.administrador_inicio=(req,res)=>{
       res.render("inicio_administrador");
    };
    controller.registro_producto= async (req,res)=>{
     const {nombre,descripcion,precio,stock_inicial}=req.body;
     const imagen = "../imagenes/"+req.file.originalname;  
     const newProducto={
       nombre,
       descripcion,
       precio,
       imagen,
       stock_inicial
     };
     await pool.query("INSERT INTO productos SET ?",[newProducto]);
        res.redirect('/lista/productos');
    };
    controller.lista_productos= async (req,res)=>{
      const productos= await pool.query("SELECT * FROM productos");
      res.render("lista_productos",{productos});
    };
    controller.administrador_inicio=(req,res)=>{
      res.render("inicio_administrador");
   };
   controller.actualizar_producto= async (req,res)=>{
    const {nombre,descripcion,precio,stock_inicial,id}=req.body;
    const imagen = "../imagenes/"+req.file.originalname;  
    const newProducto={
      nombre,
      descripcion,
      precio,
      imagen,
      stock_inicial
    };
    await pool.query("UPDATE productos SET ? WHERE id=?",[newProducto,id]);
       res.redirect('/lista/productos');
   };
   controller.eliminar_producto=async (req,res)=>{
     const {id}=req.params;
     await pool.query("DELETE FROM productos WHERE id=?",[id]);
     res.redirect('/lista/productos');
   };
   controller.detalles_producto= async(req,res)=>{
    const _id=req.user.id;
    const carrito = await pool.query('SELECT id, nombre,descripcion,precio,cantidad,imagen FROM carrito WHERE id_usuario=?',[_id]);
    const precio = await pool.query('SELECT precio FROM carrito WHERE id_usuario=?',[_id]);
    const cantidad = await pool.query('SELECT cantidad FROM carrito WHERE id_usuario=?',[_id]);
    var cont=0;
    for(let i=0; i<precio.length; i++ ){
     cont++; 
    }
  
    var articulos=0;
    for(let a=0; a<cont; a++)
    {
      articulos+=cantidad[a].cantidad;                       
    }
   const {id}=req.params;
   const producto= await pool.query("SELECT * FROM productos WHERE id=?",[id]);
   res.render("detalles_de_producto_cliente",{producto,articulos});
   };
   controller.agregar_carrito_cliente= async(req,res)=>{
     const {nombre,precio,descripcion,cantidad,imagen,id}=req.body;
     const id_producto=id;
     const id_usuario=req.user.id;
     const newProducto={
       nombre,
       precio,
       descripcion,
       cantidad,
       imagen,
       id_producto,
       id_usuario
     };
     await pool.query("INSERT INTO carrito SET ?",[newProducto]);
     res.redirect('/cliente/inicio');
   };
   controller.eliminar_producto_carrito= async(req,res)=>{
    const {id}=req.params;
    await pool.query("DELETE FROM carrito WHERE id=?",[id]);
    res.redirect("/cliente/carrito");
   };
module.exports = controller;