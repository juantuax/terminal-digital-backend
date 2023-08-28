module.exports = app => {    
    const helper = require("../controllers/helper.controller.js");
    var router = require("express").Router();

    router.get("/", helper.GetAllHelpers);
    router.get("/datasul/all", helper.GetAllHelpersDatasul);
    router.get("/phone/:id", helper.GetOneHelperPhone);
    router.get("/:id", helper.GetOneHelper);
    router.put("/:id", helper.UpdateHelper);
    router.put("trial/:id", helper.EndTrial);
    router.put("/profile/:id", helper.UpdateProfile);
    router.put("/active/:id", helper.ActiveHelper);
    router.delete("/:id", helper.DeleteHelper);

    app.use('/api/helper', router);
};