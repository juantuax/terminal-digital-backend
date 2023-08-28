module.exports = app => {
    const client = require("../controllers/client.controller.js");
    var router = require("express").Router();

    router.get("/", client.GetAllClients);
    router.get("/active", client.GetAllClientsActive);
    router.get("/:id", client.GetOneClient);
    router.put("/:id", client.UpdateClient);
    router.put("/active/:id", client.ActiveClient);
    router.post("/new", client.CreateClient);
    router.post("/datasul/new", client.CreateClientDatasul);
    router.get("/datasul/all", client.GetAllClientsDatasul);
    router.put("/datasul/update/:id", client.UpdateClientDatasul);
    router.delete("/:id", client.DeleteClient);

    app.use('/api/client', router);
};