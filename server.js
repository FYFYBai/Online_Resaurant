// server.js
const express = require('express');
const app = express();
const stripe = require("stripe")('sk_test_51Qv25GPVGcp6TkCVy1WuIa5Cp0CFi1eiTqFCHL1mvBusFVPvZvs3dhbHEnL3sHdJLo6hf5LuNKPEe7LffL3grW3W00x95HWVFe');

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Import component routes
const componentRoutes = require('./app/routes/component.route');
app.use('/api/components', componentRoutes);

// Import user routes
const userRoutes = require('./app/routes/user.route');
app.use('/api/users', userRoutes);

// //Teacher's note
// //logger npmlog
// const logger = require("npmlog");

// //origin 
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(nocache());
// app.use(cors(corsOptions));

// // parse requests of content-type -application/json
// app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// app.get('/api/test', (req, res) => {
//   logger.warn('From Npmlog', 'Npmlog is simple too %j', {'message': 'test'});
//   res.json({'message': 'Hello npmlog!'});
// })

// // simple route 
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to ToDoS application." });
// }); 

// require("./app/routes/users.routes.js")(app);

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
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "cad",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });


    const calculateOrderAmount = (items) => {
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        let total = 0;
        items.forEach((item) => {
          total += item.amount;
        });
        return total;
      };
      
      app.post("/create-payment-intent", async (req, res) => {
        const { items } = req.body;
      
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: calculateOrderAmount(items),
          currency: "cad",
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });
      
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

