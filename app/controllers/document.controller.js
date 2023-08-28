const db = require("../models");
const constants = require("../resources/constants");
const Document = db.document;

exports.GetEvidence = async (req, res) => {
    const id = req.params.id;
    await Document.findAll({ where: { DeliveryId: id } })
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