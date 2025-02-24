const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Component = sequelize.define('Component', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('cheese', 'meat'),
        allowNull: false
    }
}, {
    tableName: 'components',
    timestamps: false
});

module.exports = Component;
