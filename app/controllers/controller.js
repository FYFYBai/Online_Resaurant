const { PizzaComponent } = require('../models');
const validComponents = ['crust', 'cheese', 'sauces', 'meats', 'toppings']; // used for validation & error message
// get all components available
exports.getAllMenu = async (req, res) => {
    try {
        const components = await PizzaComponent.findAll();
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load pizza components' });
    }
};

// get components by type given
exports.getMenuByType = async (req, res) => {
    try {
        const type = req.params.type;
        // Check if the provided type is valid
        if (!validComponents.includes(type)) {
            return res.status(400).json({
                error: `"${type}" is not a valid component type. Allowed types are: ${validComponents.join(', ')}.`
            });
        }
        const components = await PizzaComponent.findAll({ where: { kind: type } });
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//methods go here