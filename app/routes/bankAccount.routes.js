module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const bankAccount = require("../controllers/bankAccount.controller.js");
    var router = require("express").Router();

    // router.get("/terminal/:id", bankAccount.GetAllBankAccounts);
    router.get("/:id", bankAccount.GetOneBankAccount);
    router.post("/new", bankAccount.CreateBankAccount);
    router.put("/:id", bankAccount.UpdateBankAccount);
    router.delete("/:id", bankAccount.DeleteBankAccount);
    router.get("/", bankAccount.GetAllBankAccounts);

    // router.get("/:id", AuthenticateJWT, bankAccount.GetOneBankAccount);
    // router.post("/new", AuthenticateJWT, bankAccount.CreateBankAccount);
    // router.put("/:id", AuthenticateJWT, bankAccount.UpdateBankAccount);
    // router.delete("/:id", AuthenticateJWT, bankAccount.DeleteBankAccount);
    app.use('/api/bank-account', router);
};