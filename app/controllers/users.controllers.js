const { User } = require('../models');
const auth = require('../utils/auth');

// Helper function to validate input when creating a user.
// This validation reflects the fields from your table:
// email, first_name, middle_name (optional), last_name, street,
// city, state, postal_code, country, password, and admin_level.
function isUserValid(req, res) {
    // Ensure client doesn't provide an id (system-generated).
    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by the system. User not saved"
        });
        return false;
    }
    // List of required fields.
    const requiredFields = [
        'email',
        'first_name',
        'last_name',
        'street',
        'city',
        'state',
        'postal_code',
        'country',
        'password'
    ];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            res.status(400).send({ message: `${field} must be provided` });
            return false;
        }
    }
    // Validate email format.
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: "Invalid email format" });
        return false;
    }
    // Validate password strength:
    // At least 8 characters, one uppercase, one lowercase, one digit, and one special character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        res.status(400).send({
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        });
        return false;
    }
    // If admin_level is provided, it must be either 'user' or 'admin'
    if (req.body.admin_level && req.body.admin_level !== 'user' && req.body.admin_level !== 'admin') {
        res.status(400).send({ message: "admin_level must be 'user' or 'admin'" });
        return false;
    }
    return true;
}

// Create a new user with full validation based on the schema.
exports.create = async (req, res) => {
    if (!isUserValid(req, res)) return;
    try {
        // Build the new user data, hashing the password before storing.
        const userData = {
            email: req.body.email,
            first_name: req.body.first_name,
            middle_name: req.body.middle_name, // optional
            last_name: req.body.last_name,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            password: auth.hash(req.body.password),
            admin_level: req.body.admin_level || 'user'
        };
        const user = await User.create(userData);
        const userJson = user.toJSON();
        delete userJson.password; // Remove password before sending response.
        res.status(201).send(userJson);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password required" });
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.password !== auth.hash(password)) {
            return res.status(403).send({ message: "Invalid credentials" });
        }
        const userJson = user.toJSON();
        delete userJson.password;
        // Optionally, generate a token (e.g., JWT) here.
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
        // If updating the password, hash it.
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
