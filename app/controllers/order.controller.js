const { Order, OrderItem, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    // Expecting: userId, items (array of { pizzaId, price, extraComponents }), totalAmount
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    // Create the order record.
    const newOrder = await Order.create({
      user_id: userId,
      total_price: totalAmount,
      status: 'Pending'
    });

    // Create associated order items.
    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      pizza_id: item.pizzaId,
      price: item.price,
      extra_components: item.extraComponents || null
    }));

    await OrderItem.bulkCreate(orderItems);

    // Include order items when retrieving the created order.
    const createdOrder = await Order.findByPk(newOrder.id, { include: [OrderItem] });

    return res.status(201).json({
      message: 'Order placed successfully',
      order: createdOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Update the status and set updated_at to the current date/time
    order.status = status;
    order.updated_at = new Date();

    await order.save();

    return res.json({ message: 'Order status updated.', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status.' });
  }
};


exports.getUserOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user by email.
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Retrieve orders for the found user including order items.
    const orders = await Order.findAll({
      where: { user_id: user.id },
      include: [OrderItem]
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders.' });
  }
};
