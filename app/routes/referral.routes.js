module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const referral = require("../controllers/referral.controller.js");
    var router = require("express").Router();

    router.get("/", referral.GetAllReferrals);
    router.get("/pending", referral.GetAllDatasulPendingReferral);
    router.get("/completed", referral.GetAllDatasulDeliveredReferral);    
    router.get("/datasul", referral.GetAllReferralsDataSul);
    router.get("/referrals", referral.GetAllReferralsDatasuls);
    router.get("/flag", referral.GetAllReferralsFlag);
    router.get("/admin/:id", referral.GetAllReferralsAdmins);
    router.get("/admin/flag/:id", referral.GetAllReferralsAdminsFlag);
    router.get("/driver/:id", referral.GetAllReferralsDrivers);
    router.get("/drivers/:id", referral.GetAllReferralsDriversPending);
    router.get("/:id", referral.GetOneReferral);
    router.get("/evidence/:id", referral.GetEvidenceDatasul);
    router.post("/new", referral.CreateReferral);
    router.post("/newtest", referral.CreateReferralTest);
    router.post("/datasul/new", referral.CreateReferralDataSul);
    router.put("/flag/:id", referral.UpdateReferralFlag);
    router.put("/close/:id", referral.CloseReferral);
    router.put("/status/:id", referral.UpdateReferralStatus);
    router.put("/test/:id", referral.ClearTestReferral);
    router.put("/datasul/:id", referral.UpdateReferralDatasul);
    router.put("/datasul/close/:id", referral.CloseReferralDatasul);
    router.put("/datasul/driver/:id", referral.UpdateDriverReferralDatasul);
    router.delete("/:id", referral.DeleteReferral);
    router.delete("/datasul/clean/:id", referral.UpdateDeliveryDatasul);
    router.delete("/datasul/cancel/:id", referral.DeleteReferralDatasul);

    app.use('/api/referral', router);
};