const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Modelos Utilizados
const Evento = require('../models/evento');
const Disponibilidad = require('../models/disponibilidad')
const Usuario = require('../models/user');
const Guia = require('../models/guia');

const controller = {};

// Metodo que registra un nuevo evento
controller.registrar = async function (data, callback) {
    try {
        Evento.create({
            Tipo: data.Tipo,
            Nombre: data.Nombre,
            Detalle: data.Detalle,
            FechaInicio: data.FechaInicio,
            FechaFin: data.FechaFin,
            Encargado: data.Encargado,
            Cupos: data.Cupos,
            Activa: true,
            Evaluacion: 'Sin Evaluacion',
            FechaCreacion: obtenerFechaHoy()
        });

        callback(null);
    } catch (err) {
        console.log('Se produjo un error en el controlador del evento: ', err);
        callback(err);
    }
};

// Metodo que retorna un arreglo de eventos
controller.getEventos = async function (idGuia, callback) {
    try {
        let response = await Evento.findAll({ 
            where: 
                {Activa: true}
        });

        // Construye un arreglo unicamente con los datos necesarios
        let eventos = response.map(resultado => resultado.dataValues);

        // Agrega la disponibilidad, en caso de tenerla
        for (let i = 0; i < eventos.length; i++) {
            let respuesta = await Disponibilidad.findAll({
                where: {
                    Evento: eventos[i].id,
                    Guia: idGuia
                }
            });
            
            if (respuesta) {
                eventos[i].Estado = response.Estado;
            }
        }

        eventos = eventos.filter(evento => evento.FechaInicio);

        // Retorna el arreglo
        callback({eventos}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Funcion que retorna la fecha presente en un string
function obtenerFechaHoy() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1; // Enero es 0!
    var year = today.getFullYear();

    let dayString = day.toString();
    let monthString = month.toString();

    if (day < 10) {
        dayString = "0" + day;
    }

    if (month < 10) {
        monthString = "0" + month;
    }

    return monthString + "/" + dayString + "/" + year + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

module.exports = controller;