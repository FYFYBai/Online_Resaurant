module.exports = app => {
    const users = require("../controllers/users.controller.js");
    var router = require("express").Router();

    // Create a new Todos
    router.post(("/"), users.create);

    // Validate authentication, similar to /:id
    router.get('/me', users.me);

    // // Retrieve all ToDos -> admin only
    // router.get("/", users.findAll)

    // //Retrieve a single ToDos with id -> admin and user can fetch their own record only
    // router.get("/:id([0-9]+)", todos.findOne);

    // //Update a ToDo with id -> admin and user can manage their own record only
    // router.put("/:id([0-9]+)", todos.update);

    // // Delete a ToDo with id -> admin only
    // router.delete("/:id([0-9]+)", todos.delete);

    app.use('/api/users', router);
};