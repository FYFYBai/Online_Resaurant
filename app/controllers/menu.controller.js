const Pizza = require('../models/pizza');
const auth = require('../utils/auth');

exports.getAllPizzas = async (req, res) => {
  try {
    // Fetch all pizzas from the 'pizzas' table
    const pizzas = await Pizza.findAll();
    res.status(200).json(pizzas);
  } catch (error) {
    console.error('Error retrieving pizzas:', error);
    res.status(500).json({ message: 'Error retrieving pizzas', error });
  }
};

// POST /api/menu - Create a new pizza (admin only)
exports.createPizza = async (req, res) => {
  try {
    const user = await auth.authenticate(req);
    if (user.admin_level !== 'admin') {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    const { name, description, base_price } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'A valid name is required.' });
    }
    if (base_price === undefined || isNaN(base_price) || Number(base_price) <= 0) {
      return res.status(400).json({ message: 'A valid base_price greater than 0 is required.' });
    }

    // Create a new pizza entry
    const newPizza = await Pizza.create({
      name: name.trim(),
      description,
      base_price
    });
    res.status(201).json(newPizza);
  } catch (error) {
    console.error('Error creating pizza:', error);
    res.status(500).json({ message: 'Error creating pizza', error: error.message });
  }
};

// PUT /api/menu/:id - Update an existing pizza (admin only)
exports.updatePizza = async (req, res) => {
  try {
    const user = await auth.authenticate(req);
    if (user.admin_level !== 'admin') {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    const { id } = req.params;
    const { name, description, base_price } = req.body;

    // Validate provided fields
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ message: "If provided, a valid name is required." });
    }
    if (base_price !== undefined && (isNaN(base_price) || Number(base_price) <= 0)) {
      return res.status(400).json({ message: "If provided, a valid base_price greater than 0 is required." });
    }

    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    if (name !== undefined) pizza.name = name.trim();
    if (description !== undefined) pizza.description = description;
    if (base_price !== undefined) pizza.base_price = base_price;

    await pizza.save();
    res.status(200).json(pizza);
  } catch (error) {
    console.error('Error updating pizza:', error);
    res.status(500).json({ message: "Error updating pizza", error: error.message });
  }
};

// DELETE /api/menu/:id - Delete a pizza (admin only)
exports.deletePizza = async (req, res) => {
  try {
    const user = await auth.authenticate(req);
    if (user.admin_level !== 'admin') {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    const { id } = req.params;
    const pizza = await Pizza.findByPk(id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    await pizza.destroy();
    res.status(200).json({ message: "Pizza deleted successfully" });
  } catch (error) {
    console.error('Error deleting pizza:', error);
    res.status(500).json({ message: "Error deleting pizza", error: error.message });
  }
};
