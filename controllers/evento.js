const connection = require('../config/database');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Modelos Utilizados
const Evento = require('../models/evento');
const Disponibilidad = require('../models/disponibilidad')
const EstadoDisp = require('../models/estado-disp')
const Usuario = require('../models/user');
const Guia = require('../models/guia');
const Indice = require('../models/indice');
const TipoCoordinacion = require('../models/tipo-coordinacion');
const Coordinacion = require('../models/coordinacion');
const Direccion = require('../models/direccion');

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

// Metodo que actualiza un evento
controller.actualizarEvento = async function (data, callback) {
    try {
        Evento.update({
            Tipo: data.Tipo,
            Nombre: data.Nombre,
            Detalle: data.Detalle,
            FechaInicio: data.FechaInicio,
            FechaFin: data.FechaFin,
            Encargado: data.Encargado,
            Cupos: data.Cupos,
        }, 
        { where: {id: data.id} } );

        callback(null);
    } catch (err) {
        console.log('Se produjo un error en el controlador del evento: ', err);
        callback(err);
    }
};

// Metodo que actuliza la disponibilidad
controller.actualizarDisp = async function (data, callback) {
    try {
        if (data.new) {
            Disponibilidad.create({
                Evento: data.id_Evento, 
                Guia: data.id_Guia,
                Estado: data.id_Estado
            });
        }
        else {
            const response = await Disponibilidad.update(
                {
                    Estado: data.id_Estado,
                },
                { where: { 
                    Evento: data.id_Evento, 
                    Guia: data.id_Guia 
                } }  // Se busca por ID
            );
        }
        callback(null);

    } catch (err) {
        console.log('Se produjo un error en el controlador de evento: ',err);
        callback(err);
    }
}

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
            let respuesta = await Disponibilidad.findOne({
                where: {
                    Evento: eventos[i].id,
                    Guia: idGuia
                }
            });
            if (respuesta) {
                eventos[i].Estado = respuesta.dataValues.Estado;
            }

            let respuesta1 = await Coordinacion.findOne({
                where: {
                    Evento: eventos[i].id,
                    Guia: idGuia
                }
            });
            if (respuesta1) {
                eventos[i].esCoordi = true;
            }

            let respuesta2 = await Usuario.findOne({
                where: {id: eventos[i].Encargado}
            });
            if (respuesta2) {
                eventos[i].NombreEncargado = respuesta2.dataValues.Nombre;
                eventos[i].SnombreEncargado = respuesta2.dataValues.Snombre;
                eventos[i].ApellidoEncargado = respuesta2.dataValues.Apellido;
            }

            let respuesta3 = await Coordinacion.findOne({
                where: {
                    Evento: eventos[i].id,
                    Guia: idGuia
                }
            });
            if (respuesta3) {
                eventos[i].esCoordinador = true;
                eventos[i].TipoCoordinador = respuesta3.dataValues.Tipo;
            }

        }

        eventos = eventos.filter(evento => evento.FechaInicio);

        // Retorna el arreglo
        callback({eventos}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que retorna un arreglo de mis eventos
controller.getMisEventos = async function (idGuia, callback) {
    try {
        let response = await Disponibilidad.findAll({ 
            where: Sequelize.and(
                {Guia: idGuia},
                Sequelize.or(
                    { Estado: 1},
                    { Estado: 2},
                    { Estado: 3}
                )
            )
        });
        
        // Construye un arreglo unicamente con los datos necesarios
        let disponibilidades = response.map(resultado => resultado.dataValues);

        // Agrega la disponibilidad, en caso de tenerla
        for (let i = 0; i < disponibilidades.length; i++) {
            let respuesta = await Evento.findAll({
                where: {
                    id: disponibilidades[i].Evento,
                    Activa: true
                }
            });
            let eventos = respuesta.map(respuesta => respuesta.dataValues);
            if (eventos) {
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
        }

        eventos = disponibilidades.filter(disponibilidad => disponibilidad.FechaInicio);

        // Retorna el arreglo
        callback({eventos}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que retorna un arreglo de todo el Staff del Evento
controller.getStaffEvento = async function (data, callback) {
    try {
        let response = await Guia.findAll();

        // Construye un arreglo todos los guias
        let staff = response.map(resultado => resultado.dataValues);
        coordis = [];
        directores = [];
        guias = [];

        for (let i = 0; i < staff.length; i++) {
            let estado = await Disponibilidad.findOne({
                where: {
                    Evento: data.evento,
                    Guia: staff[i].id
                }
            });
            if (estado) {
                staff[i].Estado = estado.dataValues.Estado;
            }
            let respuesta = await Usuario.findOne({
                where: {id: staff[i].id}
            });
            if (respuesta) {
                staff[i].Nombre = respuesta.dataValues.Nombre;
                staff[i].Snombre = respuesta.dataValues.Snombre;
                staff[i].Apellido = respuesta.dataValues.Apellido;
                staff[i].Cedula = respuesta.dataValues.Cedula;
                staff[i].Email = respuesta.dataValues.Email;
                staff[i].Username = respuesta.dataValues.Username;
            }
            if (staff[i].Rol==1 || staff[i].Rol==2 || staff[i].Rol==3)
            {
                guias.push(staff[i]);
            }
            if (staff[i].Rol==4)
            {
                staff[i].Coordinadas = 0;
                staff[i].Coordina = 0;
                coordis.push(staff[i]);
            }
            if (staff[i].Rol==5)
            {
                staff[i].Direcciona = false;
                directores.push(staff[i]);
            }
        }

        // Retorna un arreglo con todos los tipos de coordinacion
        let temp = await TipoCoordinacion.findAll();
        let tipos = temp.map(response => response.dataValues);

        for (let j = 0; j < coordis.length; j++) {
            let aux1 = await Coordinacion.findOne({
                where: {
                    Guia: coordis[j].id,
                    Evento: data.evento
                }
            });
            if (aux1) {
                coordis[j].Coordina = aux1.dataValues.Tipo;
                coordis[j].Area = tipos[aux1.dataValues.Tipo].Area;
            }
            
            let aux2 = await Coordinacion.findAll({
                where: Sequelize.and(
                    {Guia: coordis[j].id},
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
                coordis[j].Coordinadas = coordinadas.length;
            }
        } 

        for (let k = 0; k < directores.length; k++) {
            let aux1 = await Direccion.findOne({
                where: {
                    Guia: directores[k].id,
                    Evento: data.evento
                }
            });
            if (aux1) {
                directores[k].Direcciona = true;
            }
        } 

        // Retorna el arreglo
        callback({staff, directores, coordis, guias}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que retorna un arreglo de todos los roles
controller.getEstadosDisponibilidad = async function (callback) {
    try {
        let response = await EstadoDisp.findAll();

        // Construye un arreglo unicamente con los datos necesarios
        let estados = response.map(response => response.dataValues);

        // Retorna el arreglo
        callback({estados}, null);
    } catch (err) {
        callback(null, err);
    }
};

// Metodo que guarda los coordis de un evento
controller.guardarCoordis = async function (data, callback) {
    try {
        let response = await Coordinacion.findOne({
          where: {
            Guia: data.Guia,
            Evento: data.Evento
            } 
        });
        if (response) {
            Coordinacion.update({
                Tipo: data.Tipo,
            },
            {where: {
                Guia: data.Guia,
                Evento: data.Evento
            } } );
        }
        else {
            Coordinacion.create({
                Tipo: data.Tipo,
                Guia: data.Guia,
                Evento: data.Evento
            });
        }
        // let respuesta = await Coordinacion.destroy({
        //     where: {
        //         Tipo: 0
        //     }
        // });
        callback(null);
    } catch (err) {
        console.log('Se produjo un error en el controlador del evento: ', err);
        callback(err);
    }
};

// Metodo que guarda los coordis de un evento
controller.guardarDirectores = async function (data, callback) {
    try {
        let response = await Direccion.findOne({
          where: {
            Guia: data.Guia,
            Evento: data.Evento
            } 
        });
        if (response && !data.Tipo) {
            Direccion.destroy({
                Guia: data.Guia,
                Evento: data.Evento
            },
            {where: {
                Guia: data.Guia,
                Evento: data.Evento
            } } );
        }
        if (response == undefined && data.Tipo) {
            Direccion.create({
                Guia: data.Guia,
                Evento: data.Evento
            });
        }
        // let respuesta = await Direccion.destroy({
        //     where: {
        //         Tipo: 0
        //     }
        // });
        callback(null);
    } catch (err) {
        console.log('Se produjo un error en el controlador del evento: ', err);
        callback(err);
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