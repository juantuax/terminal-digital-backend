module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const admin = require("../controllers/admin.controller.js");
    var router = require("express").Router();

    router.get("/", admin.GetAllAdmins);
    router.get("/company/:id", admin.GetAdminUnities);
    router.get("/:id", admin.GetOneAdmin);
    router.get("/profile/:id", admin.GetAdminProfile);
    router.put("/:id", admin.UpdateAdmin);
    router.delete("/:id", admin.DeleteAdmin);
    router.delete("/company/:id", admin.DeleteAdminCompanies);

    // router.get("/", admin.GetAllAdmins);
    // router.get("/:id",AuthenticateJWT, admin.GetOneAdmin);
    // router.put("/:id", AuthenticateJWT, admin.UpdateAdmin);
    // router.delete("/:id", AuthenticateJWT, admin.DeleteAdmin);
    app.use('/api/admin', router);
};