module.exports = app => {
    const switchs = require("../controllers/switch.controller.js");
    var router = require("express").Router();

    router.get("/:id", switchs.GetSwitchByDriver);
    router.post("/new", switchs.CreateSwitch);
    router.post("/datasul/new", switchs.CreateSwitchDatasul);
    router.put("/:id", switchs.UpdateSwitch);

    app.use('/api/switch', router);
};