const db = require("../models");
const constants = require("../resources/constants");
const Unity = db.unity;
const Referral = db.referral;
const { Op } = require("sequelize");


// get all companies
exports.GetAllUnities= async (req, res) => {
    await Unity.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.UNITIES_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.UNITIES_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.UNITIES_NOT_FOUND
            });
        });
};

// get all companies active
exports.GetAllCompaniesActive = async (req, res) => {
    await Unity.findAll({ where: { active: 1 } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.UNITIES_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.UNITIES_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.UNITIES_NOT_FOUND
            });
        });
};

// get one unity
exports.GetOneUnity = async (req, res) => {
    const id = req.params.id;
    await Unity.findOne({ where: { id: id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.UNITY_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.UNITY_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.UNITY_NOT_FOUND
            });
        });
};
// create unity 
exports.CreateUnity = async (req, res) => {
    const model = req.body.model;
    const color = req.body.color;
    const unityPlaces = req.body.unityPlaces;
    const unityNumber = req.body.unityNumber;
    const fullname = req.body.unityName;
    const year = req.body.year;

    const result = await Unity.findOne({ where: { unityNumber: unityNumber } })
        .then(data => {
            if (data !== null) {
                return true;
            }
            return false;
        })
        .catch(err => {
            return false;
        });

    if (result !== false) {
        return res.status(409).send({
            success: 'true',
            statusCode: 409,
            data: null,
            message: constants.ALREADY_REGISTERED
        });
    }
    await Unity.create({ unityNumber: unityNumber, unityName: fullname, model: model, color: color, year: year , unityPlaces: unityPlaces })
        .then(data => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_UNITY
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_UNITY
            });
        });

};

// update unity 
exports.UpdateUnity = async (req, res) => {
    const id = req.params.id;
    const model = req.body.model;
    const color = req.body.color;
    const unityPlaces = req.body.unityPlaces;
    const unityNumber = req.body.unityNumber;
    const fullname = req.body.unityName;
    const year = req.body.year;


    const result = await Unity.findOne({ where: { [Op.and]: [{ unityNumber: { [Op.eq]: unityNumber } }, { id: { [Op.ne]: id } }] } })
        .then(data => {
            if (data !== null) {
                return true;
            }
            return false;
        })
        .catch(err => {
            return false;
        });

    if (result !== false) {
        return res.status(409).send({
            success: 'true',
            statusCode: 409,
            data: null,
            message: constants.ALREADY_REGISTERED
        });
    }
    await Unity.update({ unityNumber: unityNumber, unityName: fullname, model: model, color: color, year: year , unityPlaces: unityPlaces }, { where: { id: id } })
        .then(data => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_UNITY
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_UNITY
            });
        });

};
//delete unity  
exports.DeleteUnity = async (req, res) => {
    const id = req.params.id;
  
                await Unity.update({ active: 0 }, { where: { id: id } })
                    .then(() => {
                        res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: null,
                            message: constants.SUCCESS_DELETE_UNITY
                        });
                    })
                    .catch(err => {
                        res.status(501).send({
                            success: 'false',
                            statusCode: 500,
                            data: err,
                            message: constants.FAIL_DELETE_UNITY
                        });
                    });
            }
        

// active unity
exports.ActiveUnity = async (req, res) => {
    const id = req.params.id;
    await Unity.update({ active: 1 }, { where: { id: id } })
        .then(() => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: null,
                message: constants.SUCCESS_UPDATE_UNITY
            });
        })
        .catch(err => {
            res.status(501).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_DELETE_UNITY
            });
        });

};