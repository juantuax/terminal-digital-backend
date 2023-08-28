const db = require("../models");
const constants = require("../resources/constants");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Root = db.root;
const User = db.users;
const Picture = db.picture;

// get all Roots
exports.GetAllRoots = async (req, res) => {
    await Root.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.ROOTS_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.ROOTS_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.ROOTS_NOT_FOUND
            });
        });
};

// get one Root
exports.GetOneRoot = async (req, res) => {
    const id = req.params.id;
    await Root.findOne({ where: { id: id }, include: ['User'] })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.ROOT_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.ROOT_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.ROOT_NOT_FOUND
            });
        });
};

// get Root profile 
exports.GetRootProfile = async (req, res) => {
    const id = req.params.id;
    await Root.findOne({ where: { UserId: id }, include: ['User'] })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.ROOT_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.ROOT_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.ROOT_NOT_FOUND
            });
        });
};

// update Root 
exports.UpdateRoot = async (req, res) => {
    const id = req.params.id;
    // const dni = req.body.dni;
    // const phone = req.body.phone;
    const password = req.body.password;
    const username = req.body.username;
    const fullname = req.body.fullname;
    const userId = req.body.userId;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const picture = req.body.picture;

    const result = await User.findOne({ where: { [Op.and]: [{ username: { [Op.eq]: username } }, { id: { [Op.ne]: userId } }] } })
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
    if (picture !== '') {
        await Picture.findOne({ where: { UserId: userId } })
            .then(async data => {
                if (data !== null) {
                    await Picture.update({ path: picture }, { where: { UserId: userId } });
                     req.io.emit('picture_update', `${userId}`);
                } else {
                    await Picture.create({ path: picture, UserId: userId });
                     req.io.emit('picture_update', `${userId}`);
                }
            })
            .catch(err => {
                res.status(500).send({
                    success: 'false',
                    statusCode: 500,
                    data: err,
                    message: constants.FAIL_UPDATE_ROOT
                });
            });
    }
    await Root.update({fullname: fullname }, { where: { id: id } })
        .then(async data => {
            if (password != "") {
                await User.update({ username: username, password: passHash }, { where: { id: userId } })
                    .then(data => {
                        res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: data,
                            message: constants.SUCCESS_UPDATE_ROOT
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            success: 'false',
                            statusCode: 500,
                            data: err,
                            message: constants.FAIL_UPDATE_ROOT
                        });
                    });
            } else {
                await User.update({ username: username }, { where: { id: userId } })
                    .then(data => {
                        res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: data,
                            message: constants.SUCCESS_UPDATE_ROOT
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            success: 'false',
                            statusCode: 501,
                            data: data,
                            message: constants.FAIL_UPDATE_ROOT
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_ROOT
            });
        });
};

//delete Root  
exports.DeleteRoot = async (req, res) => {
    const id = req.params.id;
    await Root.destroy({ where: { id: id } })
        .then(() => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: null,
                message: constants.SUCCESS_DELETE_ROOT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_DELETE_ROOT
            });
        });
};