create database relojeria;
use relojeria;
CREATE TABLE usuarios(
    id int(3) AUTO_INCREMENT NOT NULL,
    correo varchar(35) NOT NULL,
    passwd varchar(250) NOT NULL,
    rol varchar(25),
    PRIMARY KEY(id)
);
CREATE TABLE suscritos(
    id int(3) AUTO_INCREMENT NOT NULL,
    correo varchar(35) NOT NULL,
    PRIMARY KEY(id)
);
create table productos(
id int(3) AUTO_INCREMENT NOT NULL,
nombre varchar(35) not null,
descripcion varchar(500) not null,
precio varchar(10) not null,
imagen varchar(250) not null,
stock_inicial int not null,
PRIMARY KEY (id)
);
create table pedidos(
id int(3) AUTO_INCREMENT NOT NULL,
nombre varchar(35) not null,
cantidad int not null,
subtotal varchar(20) not null,
total varchar(20) not null,
id_usuario int(3) not null,
PRIMARY KEY (id)
);
CREATE TABLE carrito(
    id int(3) AUTO_INCREMENT NOT NULL,
    nombre varchar(45) not null,
    precio varchar(35) not null,
    descripcion varchar(500) not null,
    cantidad int not null,
    imagen varchar(250) not null,
    id_producto int(3) not null,    
    id_usuario int(3) not null,
    PRIMARY KEY(id)
);
CREATE TABLE datos(
    id int(3) AUTO_INCREMENT NOT NULL,
    nombre varchar(45) NOT NULL,
    paterno varchar(35) NOT NULL,
    materno varchar(35) NOT NULL,
    colonia varchar(40) NOT NULL,
    primera_calle varchar(45) NOT NULL,
    segunda_calle varchar(45) NOT NULL,
    numero varchar(10) NOT NULL,
    descripcion varchar(500) NOT NULL,
    id_usuario int(3) NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT es_del_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios (id)

);

INSERT INTO usuarios(id,correo,passwd,rol) values(null,'admin@gmail.com','$2a$10$WzMT/5/ZD9bP4q60kaJ0YO/zGRS84m4jySAVg1FwGgaoT3BQnP35u','admin');