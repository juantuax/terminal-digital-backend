module.exports = app => {    
    const driver = require("../controllers/driver.controller.js");
    var router = require("express").Router();

    router.get("/", driver.GetAllDrivers);
    router.get("/datasul/all", driver.GetAllDriversDatasul);
    router.get("/phone/:id", driver.GetOneDriverPhone);
    router.get("/:id", driver.GetOneDriver);
    router.put("/:id", driver.UpdateDriver);
    router.put("trial/:id", driver.EndTrial);
    router.put("/profile/:id", driver.UpdateProfile);
    router.put("/active/:id", driver.ActiveDriver);
    router.delete("/:id", driver.DeleteDriver);

    app.use('/api/driver', router);
};