module.exports = (app) => {
    const { AuthenticateJWT } = require("../middlewares/middlewares");
    const files = require("../controllers/file.controller.js");
    const constants = require("../resources/constants");
    var router = require("express").Router();

    const path = require("path");
    const multer = require('multer');
    const uuid4 = require("uuid").v4;

    const storage = multer.diskStorage({
        destination: path.join(__dirname, "../../images"),
        filename: function (req, file, cb) {
            const fullName =
                "image_" + uuid4().replace(/-/g, "") + path.extname(file.originalname);
            cb(null, fullName);
        },
    });

    const upload = multer({ storage: storage });
    router.post("/remove", files.RemoveImage);
    // Retrieve all files
    router.get("/:id", files.GetOneImage);
    // Upload file to server
    router.post("/upload", upload.single("image"), (req, res) =>
        res.status(200).send({
            success: 'true',
            statusCode: 200,
            data: "/images/" + req.file.filename,
            message: constants.FILE_UPLOADED
        })
    );

    app.use('/api/file', router);
};