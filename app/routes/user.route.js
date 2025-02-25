const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controllers');

// POST /users
// Register a new user
router.post('/', userController.create);

// POST /users/login
// Login route to verify credentials and return user info (optionally, a token)
router.post('/login', userController.login);

// GET /users/me
// Retrieve the logged-in user's own information (authentication via headers)
router.get('/me', userController.me);

// GET /users
// Retrieve all users (admin only)
router.get('/', userController.getAllUsers);

// GET /users/:id
// Retrieve a user by ID (admin only)
router.get('/:id', userController.getUserById);

// PUT /users/:id
// Update user information. Admins can update any user; non-admins only update their own info.
router.put('/:id', userController.updateUser);

// DELETE /users/:id
// Delete a user (admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;