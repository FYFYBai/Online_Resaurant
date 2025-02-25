const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

//POST api/orders/
// Route for user to place an order
router.post('/', orderController.createOrder);

//PUT api/orders/{id}/status
// Route for admin to update order status (authentication ignored for now) by order Id
router.put('/:id/status', orderController.updateOrderStatus);

//GET api/orders/user/email/{email}
// Route for user to view orders and status by email.
router.get('/user/email/:email', orderController.getUserOrdersByEmail);

module.exports = router;
