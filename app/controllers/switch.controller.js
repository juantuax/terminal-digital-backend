const db = require("../models");
const constants = require("../resources/constants");
var o2x = require('object-to-xml');
const Switch = db.switch;
const Referral = db.referral;

exports.CreateSwitch = async (req, res) => {
    const referral = req.body.referral;
    const oldDriver = req.body.oldDriver;
    const newDriver = req.body.newDriver;

    const exist = await Switch.findOne({ where: { ReferralId: referral, OldId: oldDriver, NewId: newDriver } })
        .then(data => {
            if (data !== null) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            return false;
        });

    if (!exist) {
        await Switch.create({ ReferralId: referral, OldId: oldDriver, NewId: newDriver })
            .then(data => {
                // req.io.emit('switch_request', `${oldDriver}`);
                req.io.emit('switch_request', data);
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.SUCCESS_CREATE_SWITCH
                });
            })
            .catch(err => {
                return res.status(500).send({
                    success: 'false',
                    statusCode: 500,
                    data: err,
                    message: constants.FAIL_CREATE_SWITCH
                });
            });
    } else {        
        return res.status(200).send({
            success: 'true',
            statusCode: 200,
            data: null,
            message: constants.SUCCESS_CREATE_SWITCH
        });
    }
};

exports.UpdateSwitch = async (req, res) => {
    const referral = req.params.id;
    const oldDriver = req.body.oldDriver;
    const newDriver = req.body.newDriver;

    await Referral.update({ DriverId: newDriver }, { where: { id: referral } })
        .then(async data => {
            await Switch.update({ approved: 1 }, { where: { ReferralId: referral, OldId: oldDriver, NewId: newDriver, approved: 0 } });
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

exports.GetSwitchByDriver = async (req, res) => {
    const id = req.params.id;

    await Switch.findAll({ where: { OldId: id, approved: 0 }, include: ["Old", "New", "Referral"] })
        .then(data => {
            if (data.length > 0) {
                return res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.SWITCH_FOUND
                });
            } else {
                return res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.SWITCH_NOT_FOUND
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.SWITCH_NOT_FOUND
            });
        });
};

exports.CreateSwitchDatasul = async (req, res) => {
    const referral = req.body.referral;
    const oldDriver = req.body.oldDriver;
    const newDriver = req.body.newDriver;

    const exist = await Switch.findOne({ where: { ReferralId: referral, OldId: oldDriver, NewId: newDriver } })
        .then(data => {
            if (data !== null) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            return false;
        });

    if (!exist) {
        await Switch.create({ ReferralId: referral, OldId: oldDriver, NewId: newDriver })
            .then(data => {
                req.io.emit('switch_request', `${oldDriver}`);
                let obj = {
                    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                    result: {
                        '@': {
                            api: 'Swap Referral',
                            method: 'POST'
                        },
                        '#': {
                            'success': 'true',
                            'statusCode': 200,
                            'remision': data,
                            'message': constants.SUCCESS_CREATE_SWITCH
                        }
                    }
                };
                let xml = o2x(obj);
                return res.status(200).send(xml);
            })
            .catch(err => {
                let obj = {
                    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                    result: {
                        '@': {
                            api: 'Swap Referral',
                            method: 'POST'
                        },
                        '#': {
                            'success': 'true',
                            'statusCode': 500,
                            'message': constants.FAIL_CREATE_SWITCH
                        }
                    }
                };
                let xml = o2x(obj);
                return res.status(500).send(xml);
            });
    } else {
        let obj = {
            '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
            result: {
                '@': {
                    api: 'Swap Referral',
                    method: 'POST'
                },
                '#': {
                    'success': 'true',
                    'statusCode': 200,
                    'remision': data,
                    'message': constants.SUCCESS_CREATE_SWITCH
                }
            }
        };
        let xml = o2x(obj);
        return res.status(200).send(xml);
    }
};