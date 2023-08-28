module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const document = require("../controllers/document.controller.js");
    var router = require("express").Router();

    router.get("/:id", document.GetEvidence);
    app.use('/api/document', router);
};