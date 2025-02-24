// pizzaComponent table
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PizzaComponent = sequelize.define('PizzaComponent', {
  pizzaId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  kind: {
    type: DataTypes.ENUM('cheese','meats'),
    allowNull: false
  },
  component_Name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  }

}, {
  tableName: 'pizza_components',
  timestamps: false
});

module.exports = PizzaComponent;
