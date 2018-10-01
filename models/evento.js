const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Orden
const Evento = connection.define('Evento', 
{
    Nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    Tipo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    Detalle: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'N/A',
        validate: {
            notEmpty: true
        }
    },
    Evaluacion: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Por evaluar',
        validate: {
            notEmpty: true
        }
    },
    FechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    FechaInicio: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    FechaFin: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: true
        }
    },
    Activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            notEmpty: true
        }
    },
    Cupos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 1
        }
    },
    Encargado: {
        type: Sequelize.INTEGER,
        defaultValue: null
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = Evento;