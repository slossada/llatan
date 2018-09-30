const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Estado Disponibilidad
const EstadoDisp = connection.define('EstadoDisp',
    {
        Tipo: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = EstadoDisp;