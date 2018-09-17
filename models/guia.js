const Sequelize = require('sequelize');
const connection = require('../config/database');

// Modelo de Guia
const Guia = connection.define('Guia', 
{
    SobreNombre: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    FechaNacimiento: {
        type: Sequelize.DATE,
        defaultValue: null,
        validate: {
            isDate: true,
            isAfter: '1900-01-01'
        }
    },
    AnoIngreso: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,

        validate: {
            min: 1994,
            notEmpty: true
        }
    },
    Sexo: {
        type: Sequelize.STRING,
        defaultValue: null,
        validate: {
            isAlpha: true,
            isIn: [['Masculino', 'Femenino', 'Otro']]
        }
    },
    Rol: {
        type: Sequelize.STRING,
        defaultValue: null,
        validate: {
            isAlpha: true,
            isIn: [['Senior', 'Guia', 'Baquiano', 'Coordi']]
        }
    }
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = Guia;