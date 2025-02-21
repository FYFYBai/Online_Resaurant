// server.js
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Import restaurant routes
const restaurantRoutes = require('./app/routes/restaurant');
app.use('/api', restaurantRoutes);

// Import the Sequelize instance from your configuration
const sequelize = require('./app/config/database');
require('./app/models/index')
// Synchronize the database and then start the server
sequelize.sync()
    .then(() => {
        console.log('Database synchronized.');
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error synchronizing database:', error);
    });
