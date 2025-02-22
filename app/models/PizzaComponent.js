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
    type: DataTypes.ENUM('crust', 'cheese', 'sauces', 'meats', 'toppings'),
    allowNull: false
  },
  component_Name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  // Since Sequelize doesn't natively support MySQL SET,
  // we're storing the allowed amounts as a string (e.g., comma‐separated).
  amounts: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'pizza_components',
  timestamps: false
});

module.exports = PizzaComponent;
