const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pizza = sequelize.define('Pizza', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'pizzas',
    timestamps: false
});

module.exports = Pizza;
