const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

// GET /api/menu - Returns all pizzas
router.get('/', menuController.getAllPizzas);

// POST /api/menu - Adds a new pizza
router.post('/', menuController.createPizza);

module.exports = router;
