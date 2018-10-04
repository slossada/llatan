const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Direccion
const Direccion = connection.define('Direccion',
    {
        Guia: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Evento: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Direccion;