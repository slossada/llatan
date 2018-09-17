const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// Modelos Utilizados
const Usuario = require('../models/user');
const Guia = require('../models/guia');

const controller = {};

// Medoto que actualiza los datos de un guia
controller.actualizarDatos = async function (data, callback) {
    try {
        const response = await Guia.update(
            {
                SobreNombre: data.sobreNombre,
                FechaNacimiento: data.fechaNacimiento,
                AnoIngreso: data.anoIngreso,
                Sexo: data.sexo,
                Rol: data.rol
            },
            { where: { id: data.id } }  // Se busca por ID
        );

        callback(null);
    } catch (err) {
        console.log('Se produjo un error en el controlador de guia: ',err);
        callback(err);
    }
}

module.exports = controller;