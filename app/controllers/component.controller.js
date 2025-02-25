const { Component } = require('../models'); // Updated model import
const validComponents = ['cheese', 'meat']; // Used for validation & error messages

// Get all components available
exports.getAllComponents = async (req, res) => {
    try {
        const components = await Component.findAll();
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load pizza components' });
    }
};

// Get components by type (category)
exports.getComponentsByType = async (req, res) => {
    try {
        const type = req.params.type;

        // Check if the provided type is valid
        if (!validComponents.includes(type)) {
            return res.status(400).json({
                error: `"${type}" is not a valid component type. Allowed types are: ${validComponents.join(', ')}.`
            });
        }
        
        const components = await Component.findAll({ where: { category: type } });
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
