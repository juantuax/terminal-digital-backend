module.exports = app => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const auth = require("../controllers/auth.controller.js");
    var router = require("express").Router();

    router.post("/signin", auth.SignIn);
    router.post("/signdriver", auth.SignInPhone);
    router.post("/signout", auth.SignOut);
    router.post("/signup", auth.SignUp);
    router.post("/signup/datasul", auth.DriverRegister);
    router.put("/token/:id", auth.UpdateToken);

    app.use('/api/auth', router);
};