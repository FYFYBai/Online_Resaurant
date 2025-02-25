const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users
// Register a new user
router.post('/', userController.create);

// GET /users/me
// Retrieve the logged-in user's own info
router.get('/me', /* authMiddleware, */ userController.me);

// GET /users
// Retrieve all users (admin only)
router.get('/', /* authMiddleware, adminCheckMiddleware, */ userController.getAllUsers);

// GET /users/:id
// Retrieve a user by ID (admin only)
router.get('/:id', /* authMiddleware, adminCheckMiddleware, */ userController.getUserById);

// PUT /users/:id
// Update user info. If the user is admin, they can update anyone; otherwise, only their own info.
router.put('/:id', /* authMiddleware, userOrAdminCheckMiddleware, */ userController.updateUser);

// DELETE /users/:id
// Delete a user (admin only)
router.delete('/:id', /* authMiddleware, adminCheckMiddleware, */ userController.deleteUser);

module.exports = router;

