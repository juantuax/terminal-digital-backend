module.exports = app => {
    const location = require("../controllers/location.controller.js");
    var router = require("express").Router();

    router.get("/:driver/:referral", location.GetUserWebLocations);
    router.get("/last/:driver/:referral", location.GetUserWebLocation);
    router.get("/mobile/:id/:referral", location.GetUserReferralLocation);
    router.get("/web/:referral/:driver", location.GetWebLocations);
    router.get("/datasul", location.GetUserDatasulReferralLocation);
    router.get("/:id", location.GetUserLocation);    
    router.post("/new", location.CreateLocation);
    router.post("/phone", location.CreateLocationPhone);
    router.post("/request", location.RequestLocation);
    router.post("/refresh", location.RefreshLocation);
    router.post("/swept", location.SweptLocation);

    app.use('/api/location', router);
};