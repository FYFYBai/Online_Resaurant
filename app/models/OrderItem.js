//order_items table
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  itemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  componentAmount: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true
  },
  componentPrice: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;
