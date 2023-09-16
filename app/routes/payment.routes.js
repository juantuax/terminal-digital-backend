module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const payment = require("../controllers/payment.controller.js");
    var router = require("express").Router();

    router.get("/terminal/:terminal", payment.GetAllPaymentsTerminal);
    router.get("/root", payment.GetAllPayments);
    // router.get("/people/:people", payment.GetAllPaymentPeople);
    router.get("/:id", payment.GetOnePayment);
    router.post("/new", payment.CreatePayment);
    // router.post("/order/new", payment.CreateOrder);
    router.put("/accept/:id", payment.AcceptPayment);
    router.put("/reject/:id", payment.RejectPayment);
    router.delete("/:id", payment.DeletePayment);
    // router.get("/order/branch/:id", payment.GetAllBranchOrders);
    // router.get("/order/branch/driver/:id", payment.GetAllBranchOrdersDriver);
    // router.get("/order", payment.GetAllOrders);
    // router.get("/order/driver/:id", payment.GetAllOrdersDriver);
    // router.get("/orders/:id", payment.GetAllUserOrders);
    // router.get("/orders/detail/:id", payment.GetOrderDetail);
    // router.get("/branch/:branch", payment.GetAllPaymentBranch);
    // router.get("/people/:people", payment.GetAllPaymentPeople);
    // router.get("/:id", AuthenticateJWT, payment.GetOnePayment);
    // router.get("/orders/:id", payment.GetAllUserOrders);
    // router.post("/new", payment.CreatePayment);
    // router.post("/order/new", payment.CreateOrder);
    // router.put("/accept/:id", AuthenticateJWT, payment.AcceptPayment);
    // router.put("/reject/:id", AuthenticateJWT, payment.RejectPayment);
    // router.delete("/:id", AuthenticateJWT, payment.DeletePayment);

    app.use('/api/payment', router);
};