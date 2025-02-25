const { User } = require('../models');
const auth = require('../utils/auth');

// Helper function to validate user input during registration.
// This function ensures no client-provided id is included and that
// username and password meet the expected format.
function isUserValid(req, res) {
    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by the system. User not saved"
        });
        return false;
    }
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "username and password must be provided" });
        return false;
    }
    // Enforce username pattern: 5-45 characters (letters, digits, underscore)
    if (!req.body.username.match(/^[a-zA-Z0-9_]{5,45}$/)) {
        res.status(400).send({
            message: "username must be 5-45 characters long made up of letters, digits and underscore"
        });
        return false;
    }
    return true;
}

// Create a new user
exports.create = async (req, res) => {
    if (!isUserValid(req, res)) return;
    try {
        // Build the new user, hashing the password before storing.
        const userData = {
            username: req.body.username,
            password: auth.hash(req.body.password),
            // Only admins should ideally create admin accounts.
            // Default to 'user' if no role is provided.
            admin_level: req.body.admin_level || 'user'
        };
        const user = await User.create(userData);
        const userJson = user.toJSON();
        delete userJson.password; // Remove password before sending response.
        res.status(201).send(userJson);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error creating user."
        });
    }
};

// Retrieve the logged-in user's own information.
exports.me = async (req, res) => {
    try {
        const user = await auth.authenticate(req);
        const userJson = user.toJSON();
        delete userJson.password;
        res.status(200).send(userJson);
    } catch (err) {
        res.status(403).send({ message: err.message });
    }
};

// Optional login endpoint that verifies user credentials.
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password required" });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || user.password !== auth.hash(password)) {
            return res.status(403).send({ message: "Invalid credentials" });
        }
        const userJson = user.toJSON();
        delete userJson.password;
        // In a full application, you might generate and return a JWT token here.
        res.status(200).send(userJson);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Retrieve all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const authUser = await auth.authenticate(req);
        if (authUser.admin_level !== 'admin') {
            return res.status(403).send({ message: "Admin privileges required" });
        }
        const users = await User.findAll();
        // Remove passwords from each user record before sending.
        const sanitizedUsers = users.map(u => {
            const userObj = u.toJSON();
            delete userObj.password;
            return userObj;
        });
        res.status(200).send(sanitizedUsers);
    } catch (err) {
        res.status(403).send({ message: err.message });
    }
};

// Retrieve a user by ID (admin only)
exports.getUserById = async (req, res) => {
    try {
        const authUser = await auth.authenticate(req);
        if (authUser.admin_level !== 'admin') {
            return res.status(403).send({ message: "Admin privileges required" });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const userJson = user.toJSON();
        delete userJson.password;
        res.status(200).send(userJson);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Update user information.
// Admins can update any user; non-admins can update only their own info.
exports.updateUser = async (req, res) => {
    try {
        const authUser = await auth.authenticate(req);
        if (authUser.admin_level !== 'admin' && authUser.id != req.params.id) {
            return res.status(403).send({ message: "Unauthorized update attempt" });
        }
        // If a new password is provided, hash it.
        if (req.body.password) {
            req.body.password = auth.hash(req.body.password);
        }
        // Prevent clients from updating the user ID.
        delete req.body.id;
        const [updated] = await User.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            const userJson = updatedUser.toJSON();
            delete userJson.password;
            return res.status(200).send(userJson);
        }
        res.status(404).send({ message: "User not found" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const authUser = await auth.authenticate(req);
        if (authUser.admin_level !== 'admin') {
            return res.status(403).send({ message: "Admin privileges required" });
        }
        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted) {
            return res.status(200).send({ message: "User deleted successfully" });
        }
        res.status(404).send({ message: "User not found" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
