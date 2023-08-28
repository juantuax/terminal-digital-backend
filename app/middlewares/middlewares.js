const jwt = require("jsonwebtoken");
const accessTokenSecret = "fbqipunsjhdmrxniyktruabbomuposoohgaafetqkqhctzkugqasaxvathgvcbtqwlmtmtcagzcrihkmoswbnxwzbcoexcltrvvaiwpjnckqsoklqwllnexwvlqnsjbftckrzibilxhtxkdzpkszixawwrrjhtye";
const constants = require("../resources/constants");

exports.AuthenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.status(403).send({
                    success: 'true',
                    code: 403,
                    data: err,
                    message: constants.NOT_LOGGED
                });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).send({
            success: 'true',
            code: 401,
            data: '',
            message: constants.INVALID_TOKEN
        });
    }
};