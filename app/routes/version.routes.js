module.exports = app => {
    const version = require("../controllers/version.controller.js");
    var router = require("express").Router();

    router.get("/", version.GetAllVersions);
    router.get("/:id", version.GetOneVersion);
    router.get("/actual/version", version.GetActualVersion);
    router.post("/new", version.CreateVersion);
    router.put("/:id", version.UpdateVersion);

    app.use('/api/version', router);
};