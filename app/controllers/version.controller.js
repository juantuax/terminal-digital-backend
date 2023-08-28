const db = require("../models");
const constants = require("../resources/constants");
const Version = db.version;

exports.CreateVersion = async (req, res) => {
    const content = req.body.content;

    await Version.update({ status: 0 }, { where: { status: 1 } });
    await Version.create({ content: content, status: 1 })
        .then(data => {
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_VERSION
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_VERSION
            });
        });
};

exports.UpdateVersion = async (req, res) => {
    const id = req.params.id;
    const content = req.body.content;

    await Version.update({ content: content }, { where: { id: id } })
        .then(data => {
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_VERSION
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_VERSION
            });
        });
};

exports.GetAllVersions = async (req, res) => {
    await Version.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.VERSION_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.VERSION_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.VERSION_NOT_FOUND
            });
        });
};

exports.GetOneVersion = async (req, res) => {
    const id = req.params.id;

    await Version.findOne({ where: { id: id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.VERSION_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.VERSION_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.VERSION_NOT_FOUND
            });
        });
};

exports.GetActualVersion = async (req, res) => {
    await Version.findOne({ where: { status: 1 } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.VERSION_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.VERSION_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.VERSION_NOT_FOUND
            });
        });
};