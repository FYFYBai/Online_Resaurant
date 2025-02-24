const express = require('express');
const router = express.Router();
const ComponentController = require('../controllers/component.controller');

// GET /api/components that returns all pizza components 
router.get('/components', ComponentController.getAllComponents);

// GET /api/components/{type} that returns all pizza components with the correponding kind (enum)
router.get('/components/:type', ComponentController.getComponentsByType);

// user authentication


module.exports = router;
