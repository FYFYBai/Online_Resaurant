const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/controller');

// GET /api/components that returns all pizza components 
router.get('/components', restaurantController.getAllMenu);

// GET /api/components/{type} that returns all pizza components with the correponding kind (enum)
router.get('/components/:type', restaurantController.getMenuByType);

// SET /api/pay
// router.set('/pay', restaurantController.FunctionName);
module.exports = router;
