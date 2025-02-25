const { Order, OrderItem, User } = require('../models');
const auth = require('../utils/auth');

// Create a new order with validation for required fields and data types.
exports.createOrder = async (req, res) => {
  try {
    // Expecting: userId, items (array of { pizzaId, price, extraComponents }), totalAmount
    const { userId, items, totalAmount } = req.body;

    // Validate required fields and their types
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'A valid userId is required.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one order item is required.' });
    }
    if (!totalAmount || isNaN(totalAmount) || Number(totalAmount) <= 0) {
      return res.status(400).json({ message: 'A valid totalAmount greater than 0 is required.' });
    }

    // Validate each order item
    for (const item of items) {
      if (!item.pizzaId || isNaN(item.pizzaId)) {
        return res.status(400).json({ message: 'Each order item must have a valid pizzaId.' });
      }
      if (!item.price || isNaN(item.price) || Number(item.price) <= 0) {
        return res.status(400).json({ message: 'Each order item must have a valid price greater than 0.' });
      }
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
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// Update order status (admin only) with validation for status values.
exports.updateOrderStatus = async (req, res) => {
  try {
    // Authenticate and ensure admin access
    const user = await auth.authenticate(req);
    if (user.admin_level !== 'admin') {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    // Validate that the provided status is one of the allowed values
    const validStatuses = ['Pending', 'accepeted', 'delivered', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed statuses: ${validStatuses.join(', ')}` });
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

// Retrieve orders for a user based on their email.
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
