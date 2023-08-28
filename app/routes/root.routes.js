module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const root = require("../controllers/root.controller.js");
    var router = require("express").Router();

    router.get("/", root.GetAllRoots);
    router.get("/:id", root.GetOneRoot);
    router.put("/:id", root.UpdateRoot);
    router.delete("/:id", root.DeleteRoot);

    // router.get("/", root.GetAllroots);
    // router.get("/:id",AuthenticateJWT, root.GetOneroot);
    // router.put("/:id", AuthenticateJWT, root.Updateroot);
    // router.delete("/:id", AuthenticateJWT, root.Deleteroot);
    app.use('/api/root', router);
};