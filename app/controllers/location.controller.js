const db = require("../models");
const constants = require("../resources/constants");
const { Op } = require('sequelize');
var o2x = require('object-to-xml');
const fetch = require('node-fetch');
const Location = db.location;
const Referral = db.referral;
const moment = require("moment");

const GeocoderDirections = async (latlong) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong}&key=AIzaSyCqKecPidNbJpzL3fTjkiWEtabjBVXqzUU`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json, text/plain, */*',
        }
    })
        .then(result => { return result.json(); })
        .then(json => { return json; })
        .catch(error => { return null; })
    return response;
};

exports.GetUserLocation = async (req, res) => {
    const driver = parseInt(req.params.id);
    await Location.findOne({ where: { UserId: driver } })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.LOCATION_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.GetUserReferralLocation = async (req, res) => {
    const driver = parseInt(req.params.id);
    const referral = parseInt(req.params.referral);
    await Location.findAll({ limit: 1, where: { UserId: driver, ReferralId: referral }, order: [['createdAt', 'DESC']] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                if (data.length)
                    return res.status(200).send({
                        success: 'true',
                        statusCode: 200,
                        data: data,
                        message: constants.LOCATION_FOUND
                    });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.GetUserDatasulReferralLocation = async (req, res) => {
    const referral = parseInt(req.query.referral);
    await Location.findAll({ where: { ReferralId: referral }, order: [['createdAt', 'DESC']] })
        .then(async data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                let location = [];
                const geocoder = await GeocoderDirections(`${data[0].latitude},${data[0].longitude}`);
                for (let index = 0; index <= data.length - 1; index++) {
                    let tmpObj = {
                        '#': {
                            'latitude': data[index].latitude,
                            'longitude': data[index].longitude,
                            'city': geocoder === null ? 'SN' : geocoder.results[0].address_components[2].long_name,
                            'state': geocoder === null ? 'SN' : geocoder.results[0].address_components[4].long_name,
                            'createdAt': data[index].createdAt
                        }
                    };
                    location.push(tmpObj);
                };
                let obj = {
                    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                    locations: {
                        '@': {
                            api: 'Get Locations',
                            method: 'GET'
                        },
                        location
                    }
                };
                let xml = o2x(obj);
                return res.status(200).send(xml);
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.GetWebLocations = async (req, res) => {    
    const referral = parseInt(req.params.referral);

    await Location.findAll({ where: { ReferralId: referral }, order: [["id", "DESC"]] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.LOCATION_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.GetUserWebLocations = async (req, res) => {
    const driver = parseInt(req.params.driver);
    const referral = parseInt(req.params.referral);
    await Location.findAll({ where: { [Op.and]: [{ UserId: { [Op.eq]: driver } }, { ReferralId: { [Op.eq]: referral } }] }, order: [["id", "DESC"]] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.LOCATION_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.GetUserWebLocation = async (req, res) => {
    const driver = parseInt(req.params.driver);
    const referral = parseInt(req.params.referral);
    await Location.findAll({ where: { [Op.and]: [{ UserId: { [Op.eq]: driver } }, { ReferralId: { [Op.eq]: referral } }] }, order: [['id', 'DESC']] })
        .then(data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.LOCATION_NOT_FOUND
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.LOCATION_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.LOCATION_NOT_FOUND
            });
        });
};

exports.CreateLocation = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const referral = parseInt(req.body.referral);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (!driver || !latitude || !longitude || !referral) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    };

    await Location.create({ latitude: latitude, longitude: longitude, UserId: driver, ReferralId: referral })
        .then(async data => {
            req.io.emit('location_create', `${referral}`);
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_LOCATION
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_LOCATION
            });
        });
};

exports.CreateLocationPhone = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const referral = parseInt(req.body.referral);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const date = req.body.date;

    if (!driver || !latitude || !longitude || !referral) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    };

    const actualDateMoment = moment.utc(date);
    await Location.create({ latitude: latitude, longitude: longitude, UserId: driver, ReferralId: referral, createdAt: actualDateMoment, updatedAt: actualDateMoment })
        .then(async data => {
            req.io.emit('location_create', `${referral}`);
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_LOCATION
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_LOCATION
            });
        });
};

exports.RequestLocation = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const referral = parseInt(req.body.referral);
    const obj = {
        driver,
        referral
    };
    req.io.emit('location_request', obj);
    return res.status(200).send({
        success: 'true',
        statusCode: 200,
        data: obj,
        message: constants.SUCCESS_CREATE_LOCATION
    });
};

exports.RefreshLocation = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const referral = parseInt(req.body.referral);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const date = req.body.date;

    if (!driver || !latitude || !longitude || !referral) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    };

    await Location.findOne({ where: { createdAt: date } })
        .then(async findData => {
            if (findData === null) {
                await Location.create({ latitude: latitude, longitude: longitude, UserId: driver, ReferralId: referral, createdAt: date, updatedAt: date })
                    .then(async data => {
                        const obj = {
                            location: {
                                latitude,
                                longitude
                            },
                            driver,
                            referral
                        };
                        req.io.emit('location_refresh', obj);
                        return res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: data,
                            message: constants.SUCCESS_CREATE_LOCATION
                        });
                    })
                    .catch(err => {
                        return res.status(500).send({
                            success: 'false',
                            statusCode: 500,
                            data: err,
                            message: constants.FAIL_CREATE_LOCATION
                        });
                    });
            } else {
                const obj = {
                    location: {
                        latitude,
                        longitude
                    },
                    driver,
                    referral
                };
                req.io.emit('location_refresh', obj);
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.SUCCESS_CREATE_LOCATION
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_LOCATION
            });
        });
};

exports.SweptLocation = async (req, res) => {
    const driver = parseInt(req.body.driver);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const date = req.body.date;

    await Referral.findAll({ where: { DriverId: driver, status: 0 }, include: ['Company', 'Driver', 'Client'] })
        .then(async data => {
            if (data === null) {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.REFERRALS_DRIVER_NOT_FOUND
                });
            } else {
                if (data.length > 0) {
                    for (let index = 0; index <= data.length - 1; index++) {
                        const element = data[index];
                        if (element.flag === 1) {
                            ///// Interval logic ////////    
                            await Location.findAll({ limit: 1, where: { UserId: driver, ReferralId: element.id }, order: [['createdAt', 'DESC']] })
                                .then(async responseOld => {
                                    if (responseOld.length > 0) {
                                        let timeOldMoment = moment.utc(responseOld[0].createdAt);
                                        let actualDateMoment = moment.utc(date);
                                        let diffBettween = actualDateMoment.diff(timeOldMoment, "minutes");
                                        if (parseInt(diffBettween) >= element.requestTime) {
                                            ////// Location update method /////////
                                            await Location.create({ latitude: latitude, longitude: longitude, UserId: driver, ReferralId: element.id, createdAt: date, updatedAt: date });
                                        }
                                    } else {
                                        ////// Location update method /////////                                       
                                        await Location.create({ latitude: latitude, longitude: longitude, UserId: driver, ReferralId: element.id, createdAt: date, updatedAt: date });
                                    }
                                })
                        }
                    }
                    return res.status(200).send({
                        success: 'true',
                        statusCode: 200,
                        data: data,
                        message: constants.REFERRALS_DRIVER_FOUND
                    });
                } else {
                    return res.status(200).send({
                        success: 'true',
                        statusCode: 200,
                        data: data,
                        message: constants.REFERRALS_DRIVER_FOUND
                    });
                }
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.REFERRALS_DRIVER_NOT_FOUND
            });
        });
};