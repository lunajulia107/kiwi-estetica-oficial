const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');   
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: true,
    } 
}, {
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.senha) {
                const salt = await bcrypt.genSalt(10);
                admin.senha = await bcrypt.hash(admin.senha, salt);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.senha) {
                const salt = await bcrypt.genSalt(10);
                admin.senha = await bcrypt.hash(admin.senha, salt);
            }
        },
    },
    tableName: 'admins',
    timestamps: false
});

module.exports = Admin;
