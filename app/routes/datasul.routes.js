module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const referral = require("../controllers/referral.controller.js");
    var router = require("express").Router();

    router.get("/avisos", referral.GetAvisosDatasul);
    router.put("/clean", referral.CleanDatasul);

    app.use('/api/datasul', router);
};