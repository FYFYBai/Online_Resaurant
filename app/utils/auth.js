const crypto = require('crypto');
const { User } = require('../models');

// Hashes a string using SHA-256.
exports.hash = (string) => {
    return crypto.createHash('sha256').update(string).digest('hex');
}

// Authenticates a request based on custom headers.
// Expects x-auth-email and x-auth-password headers.
// Throws an error if authentication fails.
exports.authenticate = async (req) => {
    // Bypass authentication for public routes:
    const publicRoutes = [
      { path: '/api/users', method: 'POST' },
      { path: '/api/users/login', method: 'POST' }
    ];
    const isPublic = publicRoutes.some(route => 
      req.path.startsWith(route.path) && req.method === route.method
    );
    if (isPublic) {
      return; // Skip authentication for public routes.
    }

    const email = req.headers['x-auth-email'];
    const password = req.headers['x-auth-password'];
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        throw new Error('Authentication required');
    }
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== exports.hash(password)) {
        throw new Error('Authentication invalid');
    }
    return user;
}

