// server.js
const express = require('express');
const app = express();
const stripe = require("stripe")('sk_test_51Qv25GPVGcp6TkCVy1WuIa5Cp0CFi1eiTqFCHL1mvBusFVPvZvs3dhbHEnL3sHdJLo6hf5LuNKPEe7LffL3grW3W00x95HWVFe');

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

const calculateOrderAmount = (items) => {
    let total = 0;
    items.forEach(item => {
        total += item.amount
    });
    return total;
};

    app.post("/createpaymentintent", async (req, res) => {
    const { items } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(Items),
        currency: "cad",
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});
