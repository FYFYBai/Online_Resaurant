const Pizza = require('../models/pizza');

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

exports.createPizza = async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const { name, description, base_price } = req.body;

    // Basic validation to ensure required fields are provided
    if (!name || !base_price) {
      return res.status(400).json({ message: 'Name and base_price are required.' });
    }

    // Create a new pizza entry in the 'pizzas' table
    const newPizza = await Pizza.create({ name, description, base_price });
    res.status(201).json(newPizza);
  } catch (error) {
    console.error('Error creating pizza:', error);
    res.status(500).json({ message: 'Error creating pizza', error });
  }
};
