const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// Modelos Utilizados
const Usuario = require('../models/user');
const Guia = require('../models/guia');
const EstadoDisp = require('../models/estado-disp');
const Rol = require('../models/rol');
const Indice = require('../models/indice');
const TipoCoordinacion = require('../models/tipo-coordinacion');
const Coordinacion = require('../models/coordinacion');
const Administrador = require('../models/administrador');


const controller = {};

// Registra al usuario
controller.registrar = function (data, callback) {

    // Crea una instancia de Usuario no persistente
    let newUser = Usuario.build({
        Nombre: data.nombre,
        Snombre: data.seg_nombre,
        Apellido: data.apellido,
        Cedula: data.cedula,
        Email: data.email,
        Username: data.username,
        Password: data.password
    });

    bcrypt.genSalt(10, (err, salt) => {

        // Hashea la clave ingresada por el usuario
        bcrypt.hash(newUser.Password, salt, (err, hash) => {

            // Si se produjo un error lo lanza
            if (err) throw err;

            // Hashea la clave
            newUser.Password = hash;

            // Persiste el objeto usuario con todos sus datos
            newUser.save()
                .then(() => {
                    Guia.create({ id: newUser.id });
                })
                .then(callback)

                // Imprime el error si se produjo alguno al agregar el usuario
                .catch(err => {
                    console.log('An error ocurred while running the addUser() method: ', err);
                    callback(null, err);
                });
        });
    });
}

// Metodo utilizado para validar el usuario en config/passport.js
controller.getUserById = async function (id, callback) {
    try {
        let response = await Usuario.findById(id);
        let usuario = response.dataValues;
        let guia = await Guia.findById(id);

        if (guia){//Chequea si es un Guia
            //Agrega la informacion adicional al objeto retornado
            usuario.fechaNacimiento = guia.dataValues.FechaNacimiento;
            usuario.sexo = guia.dataValues.Sexo;
            usuario.sobreNombre = guia.dataValues.SobreNombre;
            usuario.anoIngreso = guia.dataValues.AnoIngreso;
            usuario.rol = guia.dataValues.Rol;
        }
        
        // Retornar el objeto
        callback(null, usuario);
        
    } catch (err) {
        console.log('Se produjo un error en getUserById(): ', err);
    }
}

// Metodo utilizado en el login para obtener los datos del usuario
controller.getUserByUsername = async function (username, callback) {
    try {
        let user = await Usuario.findOne({ where: { username }});
        callback(user.dataValues, null);
    } catch (err) {
        console.log('Se produjo un error en el login: ', err);
        callback(null, err);
    }
}

// Genera la clave a partir del hash y la compara con la clave ingresada
controller.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

// Metodo que retorna un arreglo toda la informacion para el login
controller.getLogin = async function (idGuia, callback) {
    try {
        let aux1 = await Rol.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let roles = aux1.map(aux1 => aux1.dataValues);

        let aux2 = await EstadoDisp.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let estados = aux2.map(aux2 => aux2.dataValues);

        let aux3 = await Guia.findById(idGuia);

        let guia = undefined;

        // Chequea si es un Guia y agrega la informacion necesaria
        if (aux3) { 
            guia = aux3.dataValues; 
        }

        let aux4 = await Administrador.findById(idGuia);

        // Chequea si es un Guia y agrega la informacion necesaria
        if (aux4) { 
            guia.esAdministrador = true; 
        }


        // Retorna un arreglo con todos los tipos de coordinacion
        let temp = await TipoCoordinacion.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let tipos = temp.map(response => response.dataValues);

        callback({roles, estados, guia, tipos}, null);


    } catch (err) {
        callback(null, err);
    }
};

module.exports = controller;