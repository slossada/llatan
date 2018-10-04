const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Indice
const Indice = connection.define('Indice',
    {
        Guia: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Puntos: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Indice;