const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// Modelos Utilizados
const Usuario = require('../models/user');
const Guia = require('../models/guia');
const Rol = require('../models/rol');
const Disponibilidad = require('../models/disponibilidad');
const Indice = require('../models/indice');
const TipoCoordinacion = require('../models/tipo-coordinacion');
const Coordinacion = require('../models/coordinacion');

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

// Metodo que retorna un arreglo de todos los roles
controller.getRoles = async function (callback) {
    try {
        let response = await Rol.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let roles = response.map(response => response.dataValues);

        // Retorna el arreglo
        callback({roles}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que retorna un arreglo de coordis y baquianos
controller.getCoordisyBaquianos = async function (callback) {
    try {
        let response = await Guia.findAll({ 
            where: 
                Sequelize.or({Rol: 5}, {Rol: 4}, {Rol: 3})
        });

        // Construye un arreglo unicamente con los datos necesarios
        let guias = response.map(resultado => resultado.dataValues);

        // Agrega los datos basicos del guia
        for (let i = 0; i < guias.length; i++) {
            let response = await Usuario.findOne({
                where: {
                    id: guias[i].id
                }
            });

            if (response) {
                guias[i].Nombre = response.dataValues.Nombre;
                guias[i].Snombre = response.dataValues.Snombre;
                guias[i].Apellido = response.dataValues.Apellido;
                guias[i].Cedula = response.dataValues.Cedula;
                guias[i].Email = response.dataValues.Email;
                guias[i].Username = response.dataValues.Username;
            }
        }

        guias = guias.filter(guia => guia.Rol);

        // Retorna el arreglo
        callback({guias}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que retorna un arreglo de coordis
controller.getCoordis = async function (data, callback) {
    try {
        let response = await Guia.findAll({ 
            where: {Rol: 4}
        });

        // Construye un arreglo unicamente con los datos necesarios
        let coordis = response.map(resultado => resultado.dataValues);

            // Retorna un arreglo con todos los tipos de coordinacion
            let temp = await TipoCoordinacion.findAll();

            // Construye un arreglo unicamente con los datos necesarios
            let tipos = temp.map(response => response.dataValues);

        // Agrega los datos basicos del coordi
        for (let i = 0; i < coordis.length; i++) {
            let response = await Usuario.findOne({
                where: {
                    id: coordis[i].id
                }
            });

            if (response) {
                coordis[i].Nombre = response.dataValues.Nombre;
                coordis[i].Snombre = response.dataValues.Snombre;
                coordis[i].Apellido = response.dataValues.Apellido;
                coordis[i].Cedula = response.dataValues.Cedula;
                coordis[i].Email = response.dataValues.Email;
                coordis[i].Username = response.dataValues.Username;
                coordis[i].Coordinadas = 0;
                coordis[i].Coordina = 0;

            }

            let aux = await Coordinacion.findOne({
                where: {
                    Guia: coordis[i].id,
                    Evento: data.evento
                }
            });

            if (aux) {
                let coordina = aux.dataValues;
                coordis[i].Coordina = coordina.Tipo;
                coordis[i].Area = tipos[coordina.Tipo].Area;
            }

            let aux2 = await Coordinacion.findAll({
                where: Sequelize.and(
                    {Guia: coordis[i].id},
                    Sequelize.or(
                        { Tipo: 1},
                        { Tipo: 2},
                        { Tipo: 3},
                        { Tipo: 4},
                        { Tipo: 5},
                    )
                )
            });

            if (aux2) {
                let coordinadas = aux2.map(resultado => resultado.dataValues);
                coordis[i].Coordinadas = coordinadas.length;
            }
        }



        // Retorna el arreglo
        callback({coordis}, null);
    } catch (err) {
        callback(null, err);
    }
};

module.exports = controller;