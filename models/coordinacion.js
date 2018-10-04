const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Coordinacion
const Coordinacion = connection.define('Coordinacion',
    {
        Guia: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Evento: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Tipo: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Coordinacion;