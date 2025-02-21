//the file that combines all tables together to be required by server.js
const PizzaComponent = require('./PizzaComponent');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations

// A user can have many orders.
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// An order can have many order items.
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// A pizza component can be part of many order items.
PizzaComponent.hasMany(OrderItem, { foreignKey: 'componentId' });
OrderItem.belongsTo(PizzaComponent, { foreignKey: 'componentId' });

module.exports = {
  PizzaComponent,
  User,
  Order,
  OrderItem
};
