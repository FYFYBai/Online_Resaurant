const { Component } = require('../models');
const auth = require('../utils/auth');
const validComponents = ['cheese', 'meat'];

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

// POST /api/components - Create a new component (admin only)
exports.createComponent = async (req, res) => {
    try {
        const user = await auth.authenticate(req);
        if (user.admin_level !== 'admin') {
            return res.status(403).json({ message: "Admin privileges required" });
        }
        const { name, price, category } = req.body;

        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "A valid name is required." });
        }
        if (price === undefined || isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ message: "A valid price greater than 0 is required." });
        }
        if (!category || typeof category !== 'string') {
            return res.status(400).json({ message: "Category is required." });
        }
        // Validate category against allowed values
        if (!validComponents.includes(category)) {
            return res.status(400).json({ message: `Invalid category. Allowed values: ${validComponents.join(', ')}` });
        }

        const newComponent = await Component.create({ name: name.trim(), price, category });
        res.status(201).json(newComponent);
    } catch (error) {
        res.status(500).json({ message: "Error creating component", error: error.message });
    }
};


// PUT /api/components/:id - Update an existing component (admin only)
exports.updateComponent = async (req, res) => {
    try {
        const user = await auth.authenticate(req);
        if (user.admin_level !== 'admin') {
            return res.status(403).json({ message: "Admin privileges required" });
        }
        const { id } = req.params;
        const { name, price, category } = req.body;
        if (category && !validComponents.includes(category)) {
            return res.status(400).json({ message: `Invalid category. Allowed values: ${validComponents.join(', ')}` });
        }
        const component = await Component.findByPk(id);
        if (!component) {
            return res.status(404).json({ message: "Component not found" });
        }
        if (name !== undefined) component.name = name;
        if (price !== undefined) component.price = price;
        if (category !== undefined) component.category = category;
        await component.save();
        res.status(200).json(component);
    } catch (error) {
        res.status(500).json({ message: "Error updating component", error: error.message });
    }
};

// DELETE /api/components/:id - Delete a component (admin only)
exports.deleteComponent = async (req, res) => {
    try {
        const user = await auth.authenticate(req);
        if (user.admin_level !== 'admin') {
            return res.status(403).json({ message: "Admin privileges required" });
        }
        const { id } = req.params;
        const component = await Component.findByPk(id);
        if (!component) {
            return res.status(404).json({ message: "Component not found" });
        }
        await component.destroy();
        res.status(200).json({ message: "Component deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting component", error: error.message });
    }
};
