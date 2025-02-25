const express = require('express');
const router = express.Router();
const ComponentController = require('../controllers/component.controller');

// GET /api/components - Returns all pizza components 
router.get('/', ComponentController.getAllComponents);

// GET /api/components/:type - Returns components by type (enum)
router.get('/:type', ComponentController.getComponentsByType);

// POST /api/components - Create a new component (admin only)
router.post('/', ComponentController.createComponent);

// PUT /api/components/:id - Update an existing component (admin only)
router.put('/:id', ComponentController.updateComponent);

// DELETE /api/components/:id - Delete a component (admin only)
router.delete('/:id', ComponentController.deleteComponent);

module.exports = router;
