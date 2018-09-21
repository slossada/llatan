const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Disponibilidad
const Disponibilidad = connection.define('Disponibilidad',
    {
        Evento: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Guia: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Estado: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Disponibilidad;