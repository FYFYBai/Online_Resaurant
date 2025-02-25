const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

// GET /api/menu - Returns all pizzas
router.get('/', menuController.getAllPizzas);

// POST /api/menu - Adds a new pizza (admin only)
router.post('/', menuController.createPizza);

// PUT /api/menu/:id - Update an existing pizza (admin only)
router.put('/:id', menuController.updatePizza);

// DELETE /api/menu/:id - Delete a pizza (admin only)
router.delete('/:id', menuController.deletePizza);

module.exports = router;
