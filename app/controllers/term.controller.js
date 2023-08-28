const db = require("../models");
const constants = require("../resources/constants");
const Term = db.term;

// Get all register terms
exports.GetAll = async (req, res) => {
    await Term.findAll({ include: ["Driver"] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.TERM_NOT_FOUND
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.TERM_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.TERM_NOT_FOUND
            });
        });
};

// Get all register terms driver
exports.GetOne = async (req, res) => {
    const driver = parseInt(req.params.id);
    const version = req.params.version;
    await Term.findAll({ where: { DriverId: driver, version: version }, include: ["Driver"] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.TERM_NOT_FOUND
                });
            } else {
                if (data.length > 0) {
                    return res.status(200).send({
                        success: 'true',
                        statusCode: 200,
                        data: data,
                        message: constants.TERM_FOUND
                    });
                } else {
                    return res.status(404).send({
                        success: 'true',
                        statusCode: 404,
                        data: null,
                        message: constants.TERM_NOT_FOUND
                    });
                }
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.TERM_NOT_FOUND
            });
        });
};

// Create term
exports.CreateTerm = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const version = req.body.version;

    if (!driver || !version) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    };

    await Term.create({ version: version, DriverId: driver })
        .then(async data => {
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_TERM
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_TERM
            });
        });
};