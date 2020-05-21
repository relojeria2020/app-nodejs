const express= require("express");
const indexController = require('../controllers/IndexController');
const router= express.Router();

router.get('/',indexController.index);
router.get('/inicio/sesion',indexController.inicio);
router.get('/contacto',indexController.contacto);
router.get('/registrarse',indexController.registrarse);
router.post('/suscribirse',indexController.suscribirse);
router.post('/auth',indexController.auth);
router.get('/cliente/inicio',indexController.cliente_inicio);
router.get('/cliente/carrito',indexController.cliente_carrito);
router.post('/registro',indexController.registro);
router.get('/cerrar',indexController.cerrar);
router.get('/cliente/datos/envio',indexController.datos_cliente);
router.post('/cliente/datos/envio',indexController.datos_cliente_registro);
router.post('/cliente/datos/actualizar',indexController.datos_cliente_actualizar);
router.post('/cliente/pago/productos',indexController.pago);

//administrador
router.get('/administrador/inicio',indexController.administrador_inicio);
router.post('/registro/producto',indexController.registro_producto);
router.get('/lista/productos',indexController.lista_productos);
router.post('/actualizar/producto',indexController.actualizar_producto);
router.get('/producto/eliminar/:id',indexController.eliminar_producto);
router.get('/detalles/producto/:id',indexController.detalles_producto);
router.post('/agregar/carrito',indexController.agregar_carrito_cliente);
router.get('/carrito/eliminar/:id',indexController.eliminar_producto_carrito);
module.exports= router;
