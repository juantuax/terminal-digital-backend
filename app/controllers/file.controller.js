const db = require("../models");
const constants = require("../resources/constants");
const Picture = db.picture;
const fs = require('fs');

exports.RemoveImage = async (req, res) => {
    fs.unlink(req.body.path, (err => {
        if (err) {

        } else {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: null,
                message: constants.FILE_UPLOADED
            });
        }
    }));
};

exports.GetOneImage = async (req, res) => {
    const id = req.params.id;
    await Picture.findOne({ where: { UserId: id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.PICTURE_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.PICTURE_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.PICTURE_NOT_FOUND
            });
        });
};