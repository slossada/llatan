const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Tipo Coordinacion
const TipoCoordinacion = connection.define('TipoCoordinacion',
    {
        Area: {
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

module.exports = TipoCoordinacion;