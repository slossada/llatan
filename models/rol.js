const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Rol
const Rol = connection.define('Rol',
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

module.exports = Rol;