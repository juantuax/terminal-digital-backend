module.exports = app => {    
    const term = require("../controllers/term.controller.js");
    var router = require("express").Router();

    router.get("/", term.GetAll);
    router.get("/:id/:version", term.GetOne);
    router.post("/new", term.CreateTerm);

    app.use('/api/terms', router);
};