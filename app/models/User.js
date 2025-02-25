const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: false 
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false 
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false 
    },
    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false 
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false 
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    admin_level: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
