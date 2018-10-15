const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Disponibilidad
const Disponibilidad = connection.define('Disponibilidad',
    {
        Evento: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Guia: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Estado: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Coordina: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        esDirector: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Disponibilidad;