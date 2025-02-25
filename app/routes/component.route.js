const express = require('express');
const router = express.Router();
const ComponentController = require('../controllers/component.controller');

// GET /api/components that returns all pizza components 
router.get('/', ComponentController.getAllComponents);

// GET /api/components/{type} that returns all pizza components with the correponding kind (enum)
router.get('/:type', ComponentController.getComponentsByType);

//A method should go here to modify components, only available to admins


module.exports = router;
