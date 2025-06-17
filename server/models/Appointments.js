const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Appointment = sequelize.define('Appointment', {
    nome: { type: DataTypes.STRING, allowNull: false },
    celular: { type: DataTypes.STRING, allowNull: false },
    categoria: { type: DataTypes.STRING, allowNull: false },
    procedimento: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.DATEONLY, allowNull: false },
    horario: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'appointments',
    timestamps: false
});

module.exports = Appointment;
