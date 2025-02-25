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
    const email = req.headers['x-auth-email'];
    const password = req.headers['x-auth-password'];
    if (!email || !password) {
        throw new Error('Authentication required');
    }
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== exports.hash(password)) {
        throw new Error('Authentication invalid');
    }
    return user;
}
