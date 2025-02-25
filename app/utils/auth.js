const crypto = require('crypto');
const { User } = require('../models'); // Adjust the path if necessary

// Hashes a string using SHA-256.
exports.hash = (string) => {
    return crypto.createHash('sha256').update(string).digest('hex');
}

// Authenticates a request based on custom headers.
// Expects x-auth-username and x-auth-password headers.
// Throws an error if authentication fails.
exports.authenticate = async (req) => {
    const username = req.headers['x-auth-username'];
    const password = req.headers['x-auth-password'];
    if (!username || !password) {
        throw new Error('Authentication required');
    }
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== exports.hash(password)) {
        throw new Error('Authentication invalid');
    }
    return user;
}
