module.exports = app => {    
    const session = require("../controllers/session.controller.js");
    var router = require("express").Router();

    router.get("/", session.GetAllSessions);
    // router.get("/datasul/all", session.GetAllsessionsDatasul);
    // router.get("/phone/:id", session.GetOnesessionPhone);
    // router.get("/:id", session.GetOnesession);
    // router.put("/:id", session.Updatesession);
    // router.put("trial/:id", session.EndTrial);
    // router.put("/profile/:id", session.UpdateProfile);
    // router.put("/active/:id", session.Activesession);
    // router.delete("/:id", session.Deletesession);

    app.use('/api/session', router);
};