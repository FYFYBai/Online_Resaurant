// models/index.js
const sequelize = require('../config/database');

const User = require('./user.js');
const Pizza = require('./pizza.js');
const Component = require('./components.js');
const Order = require('./order.js');
const OrderItem = require('./orderItem.js');

// Define associations:
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

//a single pizza (record in the pizzas table) can appear on many different order items across different orders.
Pizza.hasMany(OrderItem, { foreignKey: 'pizza_id' });
OrderItem.belongsTo(Pizza, { foreignKey: 'pizza_id' });

// Export all models for easy import:
module.exports = {
  sequelize,
  User,
  Pizza,
  Component,
  Order,
  OrderItem
};
