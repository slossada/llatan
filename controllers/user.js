const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// Modelos Utilizados
const Usuario = require('../models/user');
const EstadoDisp = require('../models/estado-disp');
const Rol = require('../models/rol');
const TipoCoordinacion = require('../models/tipo-coordinacion');

const controller = {};

// Registra al usuario
controller.registrar = function (data, callback) {

    // Crea una instancia de Usuario no persistente
    let newUser = Usuario.build({
        Nombre: data.Nombre,
        Snombre: data.Snombre,
        Apellido: data.Apellido,
        Cedula: data.Cedula,
        Email: data.Email,
        Username: data.Username,
        Password: data.Password,
        SobreNombre: data.SobreNombre,
        FechaNacimiento: data.FechaNacimiento,
        AnoIngreso: data.AnoIngreso,
        Sexo: data.Sexo,
        Rol: data.Rol
    });

    bcrypt.genSalt(10, (err, salt) => {

        // Hashea la clave ingresada por el usuario
        bcrypt.hash(newUser.Password, salt, (err, hash) => {

            // Si se produjo un error lo lanza
            if (err) throw err;

            // Hashea la clave
            newUser.Password = hash;

            // Persiste el objeto usuario con todos sus datos
            newUser.save().then(callback)

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
controller.getLogin = async function (callback) {
    try {
        let aux1 = await Rol.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let roles = aux1.map(aux1 => aux1.dataValues);

        let aux2 = await EstadoDisp.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let estados = aux2.map(aux2 => aux2.dataValues);

        // Retorna un arreglo con todos los tipos de coordinacion
        let temp = await TipoCoordinacion.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let tipos = temp.map(response => response.dataValues);

        callback({roles, estados, tipos}, null);


    } catch (err) {
        callback(null, err);
    }
};

module.exports = controller;