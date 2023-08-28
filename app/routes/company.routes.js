module.exports = app => {    
    const company = require("../controllers/unity.controller.js");
    var router = require("express").Router();

    router.get("/", company.GetAllUnities);
    router.get("/active", company.GetAllCompaniesActive);
    router.get("/:id", company.GetOneUnity);
    router.post("/new", company.CreateUnity);
    router.put("/:id", company.UpdateUnity);
    router.put("/active/:id", company.ActiveUnity);
    router.delete("/:id", company.DeleteUnity);

    app.use('/api/unity', router);
};