const db = require("../models");
const constants = require("../resources/constants");
const Client = db.client;
const Referral = db.referral;
const { Op } = require("sequelize");
var o2x = require('object-to-xml');

// get all clients
exports.GetAllClients = async (req, res) => {
    await Client.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.CLIENTS_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.CLIENTS_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.CLIENTS_NOT_FOUND
            });
        });
};

exports.GetAllClientsActive = async (req, res) => {
    await Client.findAll({ where: { active: 1 } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.CLIENTS_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.CLIENTS_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.CLIENTS_NOT_FOUND
            });
        });
};

// get one client
exports.GetOneClient = async (req, res) => {
    const id = req.params.id;
    await Client.findOne({ where: { id: id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.CLIENT_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.CLIENT_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.CLIENT_NOT_FOUND
            });
        });
};

exports.CreateClientDatasul = async (req, res) => {
    let codeClient = req.body.codeClient;
    let fullname = req.body.fullname;

    fullname = fullname.replace("%20", " ");
    fullname = fullname.replace("%D1", "Ñ");
    fullname = fullname.replace("%F1", "ñ");
    fullname = fullname.replace("%23", "#");
    fullname = fullname.replace("%E9", "é");    

    if (!(fullname) || !(codeClient)) {
        let obj = {
            '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
            result: {
                '@': {
                    api: 'Save Client',
                    method: 'POST'
                },
                '#': {
                    'success': 'true',
                    'statusCode': 400,
                    'message': constants.EMPTY_DATA
                }
            }
        };
        let xml = o2x(obj);
        return res.status(400).send(xml);
    }
    const result = await Client.findOne({ where: { codeClient: codeClient } })
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
        let obj = {
            '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
            result: {
                '@': {
                    api: 'Save Client',
                    method: 'POST'
                },
                '#': {
                    'success': 'true',
                    'statusCode': 409,
                    'message': constants.ALREADY_REGISTERED
                }
            }
        };
        let xml = o2x(obj);
        return res.status(409).send(xml);
    }
    await Client.create({ codeClient: codeClient, fullname: fullname })
        .then(async data => {
            let obj = {
                '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                result: {
                    '@': {
                        api: 'Save Client',
                        method: 'POST'
                    },
                    '#': {
                        'success': 'true',
                        'statusCode': 200,
                        'message': constants.SUCCESS_CREATE_CLIENT
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
                        api: 'Save Client',
                        method: 'POST'
                    },
                    '#': {
                        'success': 'false',
                        'statusCode': 500,
                        'message': constants.FAIL_CREATE_CLIENT
                    }
                }
            };
            let xml = o2x(obj);
            return res.status(500).send(xml);
        });
};

exports.GetAllClientsDatasul = async (req, res) => {
    await Client.findAll({ where: { active: 1 } })
        .then(data => {
            if (data === null) {
                let obj = {
                    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                    result: {
                        '@': {
                            api: 'GET Client',
                            method: 'GET'
                        },
                        '#': {
                            'success': 'true',
                            'statusCode': 400,
                            'message': constants.CLIENTS_NOT_FOUND
                        }
                    }
                };
                let xml = o2x(obj);
                return res.status(400).send(xml);
            } else {
                let client = [];
                for (let index = 0; index <= data.length - 1; index++) {
                    let tmpObj = {
                        '#': {
                            'id': data[index].id,
                            'fullname': data[index].fullname,
                            'code': data[index].codeClient
                        }
                    };
                    client.push(tmpObj);
                };
                let obj = {
                    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                    clients: {
                        '@': {
                            api: 'GET Clients',
                            method: 'GET'
                        },
                        client
                    }
                };
                let xml = o2x(obj);
                return res.status(200).send(xml);
            }
        })
        .catch(err => {
            let obj = {
                '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                result: {
                    '@': {
                        api: 'GET Client',
                        method: 'GET'
                    },
                    '#': {
                        'success': 'false',
                        'statusCode': 500,
                        'message': constants.CLIENTS_NOT_FOUND
                    }
                }
            };
            let xml = o2x(obj);
            return res.status(500).send(xml);
        });
};

exports.UpdateClientDatasul = async (req, res) => {
    const id = req.params.id;
    const codeClient = req.body.codeClient;
    const fullname = req.body.fullname;
    const result = await Client.findOne({ where: { [Op.and]: [{ codeClient: { [Op.eq]: codeClient } }, { id: { [Op.ne]: id } }] } })
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
        let obj = {
            '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
            result: {
                '@': {
                    api: 'PUT Client',
                    method: 'PUT'
                },
                '#': {
                    'success': 'true',
                    'statusCode': 409,
                    'message': constants.ALREADY_REGISTERED
                }
            }
        };
        let xml = o2x(obj);
        return res.status(409).send(xml);
    }
    await Client.update({ codeClient: codeClient, fullname: fullname }, { where: { id: id } })
        .then(data => {
            let obj = {
                '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
                result: {
                    '@': {
                        api: 'PUT Client',
                        method: 'PUT'
                    },
                    '#': {
                        'success': 'true',
                        'statusCode': 200,
                        'message': constants.SUCCESS_UPDATE_CLIENT
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
                        api: 'PUT Client',
                        method: 'PUT'
                    },
                    '#': {
                        'success': 'false',
                        'statusCode': 500,
                        'message': constants.FAIL_UPDATE_CLIENT
                    }
                }
            };
            let xml = o2x(obj);
            return res.status(500).send(xml);
        });
};

// create a new client
exports.CreateClient = async (req, res) => {
    const codeClient = req.body.codeClient;
    const fullname = req.body.fullname;

    if (!(fullname) || !(codeClient)) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    }
    const result = await Client.findOne({ where: { codeClient: codeClient } })
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
    await Client.create({ codeClient: codeClient, fullname: fullname })
        .then(async data => {

            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_CLIENT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_CLIENT
            });
        });
};

// update client 
exports.UpdateClient = async (req, res) => {
    const id = req.params.id;
    const codeClient = req.body.codeClient;
    const fullname = req.body.fullname;
    const result = await Client.findOne({ where: { [Op.and]: [{ codeClient: { [Op.eq]: codeClient } }, { id: { [Op.ne]: id } }] } })
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
    await Client.update({ codeClient: codeClient, fullname: fullname }, { where: { id: id } })
        .then(data => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_CLIENT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_CLIENT
            });
        });
};

//delete client  
exports.DeleteClient = async (req, res) => {
    const id = req.params.id;
    await Referral.findOne({ where: { [Op.and]: [{ ClientId: { [Op.eq]: id } }, { status: { [Op.eq]: 0 } }] } })
        .then(async dataDelete => {
            if (dataDelete == null) {
                await Client.update({ active: 0 }, { where: { id: id } })
                    .then(() => {
                        res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: null,
                            message: constants.SUCCESS_DELETE_DRIVER
                        });
                    })
                    .catch(err => {
                        res.status(501).send({
                            success: 'false',
                            statusCode: 500,
                            data: err,
                            message: constants.FAIL_DELETE_DRIVER
                        });
                    });
            }
            else {
                res.status(401).send({
                    success: 'true',
                    statusCode: 401,
                    data: null,
                    message: constants.RELATION_EXISTS
                });
            }
        })
        .catch(err => {
            res.status(503).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_DELETE_DRIVER
            });
        });
};

// active client
exports.ActiveClient = async (req, res) => {
    const id = req.params.id;
    await Client.update({ active: 1 }, { where: { id: id } })
        .then(() => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: null,
                message: constants.SUCCESS_UPDATE_CLIENT
            });
        })
        .catch(err => {
            res.status(501).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_DELETE_CLIENT
            });
        });

};