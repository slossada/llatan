const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// Modelos Utilizados
const Usuario = require('../models/user');
const Rol = require('../models/rol');
const Disponibilidad = require('../models/disponibilidad');
const TipoCoordinacion = require('../models/tipo-coordinacion');
const Evento = require('../models/evento');

const controller = {};

// Medoto que actualiza los datos de un guia
controller.actualizarDatos = async function (data, callback) {
    try {
        const response = await Usuario.update(
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
        let response = await Usuario.findAll({ 
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

// Metodo que retorna dos arreglos con la informacion del guia y sus eventos
controller.getPerfil = async function (data, callback) {
    try {
        let response1 = await Usuario.findOne({ 
            where: {id: data.id_Guia}
        });

        let user = response1.dataValues;

        let response2 = await Disponibilidad.findAll({ 
            where: Sequelize.and(
                {Guia: data.id_Guia},
                Sequelize.or(
                    { Estado: 1},
                    { Estado: 2},
                    { Estado: 3},
                )
            )
        });
        
        // Construye un arreglo unicamente con los datos necesarios
        let disponibilidades = response2.map(resultado => resultado.dataValues);

        // Agrega la informacion del evento
        for (let i = 0; i < disponibilidades.length; i++) {
            let respuesta = await Evento.findAll({
                where: {
                    id: disponibilidades[i].Evento,
                    Activa: true
                }
            });
            let eventos = respuesta.map(respuesta => respuesta.dataValues);
            if (eventos[0]) {
                disponibilidades[i].id = eventos[0].id;
                disponibilidades[i].Tipo = eventos[0].Tipo;
                disponibilidades[i].Nombre = eventos[0].Nombre;
                disponibilidades[i].Detalle = eventos[0].Detalle;
                disponibilidades[i].FechaInicio = eventos[0].FechaInicio;
                disponibilidades[i].FechaFin = eventos[0].FechaFin;
                disponibilidades[i].Cupos = eventos[0].Cupos;
                disponibilidades[i].Encargado = eventos[0].Encargado;
                disponibilidades[i].Evaluacion = eventos[0].Evaluacion;
                disponibilidades[i].FechaCreacion = eventos[0].FechaCreacion;
            }
            let respuesta2 = await Usuario.findOne({
                where: {id: disponibilidades[i].Encargado}
            });
            if (respuesta2) {
                disponibilidades[i].NombreEncargado = respuesta2.dataValues.Nombre;
                disponibilidades[i].SnombreEncargado = respuesta2.dataValues.Snombre;
                disponibilidades[i].ApellidoEncargado = respuesta2.dataValues.Apellido;
            }
        }

        eventos = disponibilidades.filter(disponibilidad => disponibilidad.FechaInicio);

        // Retorna el arreglo
        callback({user, eventos}, null);
    } catch (err) {
        callback(null, err);
    }
};

module.exports = controller;