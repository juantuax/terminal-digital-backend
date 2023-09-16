const db = require("../models");
const constants = require("../resources/constants");
const { Op } = require("sequelize");
const Payment = db.payments;

// get all payments of a branch side
exports.GetAllPayments = async (req, res) => {
    await Payment.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.PAYMENTS_BRANCH_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',

                    statusCode: 200,
                    data: data,
                    message: constants.PAYMENTS_BRANCH_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.PAYMENTS_BRANCH_NOT_FOUND
            });
        });
};
// get all payments of a branch side
exports.GetAllPaymentsTerminal = async (req, res) => {
    const terminal = req.params.terminal
    await Payment.findAll({ where: { TerminalId: terminal } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.PAYMENTS_BRANCH_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',

                    statusCode: 200,
                    data: data,
                    message: constants.PAYMENTS_BRANCH_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.PAYMENTS_BRANCH_NOT_FOUND
            });
        });
};

// get one payment 
exports.GetOnePayment = async (req, res) => {
    const id = req.params.id;
    await Payment.findOne({ where: { id: id }, include: ["BankAccount","Terminal"] })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.PAYMENT_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.PAYMENT_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.PAYMENT_NOT_FOUND
            });
        });
};

// create a new payment
exports.CreatePayment = async (req, res) => {
    const dni = req.body.dni;
    const fullname = req.body.fullname;
    const amount = req.body.amount;
    const date = req.body.date;
    const terminal = req.body.terminal;
    const bank = req.body.bank;
    const ref = req.body.ref;
    const account = req.body.account;
    const type = req.body.type;
    const photo = req.body.photo;
    const status = req.body.status

    if (!(dni) || !(date) || !(amount) || !(fullname)  || !(terminal)) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    }

    await Payment.create({ dni: dni, date: date, amount: amount, TerminalId: terminal, bank_emision: bank, ref_number: ref, BankAccountId: account, fullname: fullname,  type: type, status: status, observation: '', photo: photo })
        .then(data => {
            return res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_PAYMENT
            });
        })
        .catch(err => {
            return res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_PAYMENT
            });
        });
};

// accept payment 
exports.AcceptPayment = async (req, res) => {
    const id = req.params.id;
    await Payment.update({ status: 1 }, { where: { id: id } })
        .then(async data => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_PAYMENT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_PAYMENT
            });
        })
};

// reject payment
exports.RejectPayment = async (req, res) => {
    const id = req.params.id;
    const observation = req.body.observation;
    await Payment.update({ status: 2, observation: observation }, { where: { id: id } })
        .then(data => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_PAYMENT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_PAYMENT
            });
        })
};

//delete payment 
exports.DeletePayment = async (req, res) => {
    const id = req.params.id;
    await Payment.findAll({
        where: { id: id }
    })
        .then(async data => {
            if (data.status == 0) {
                return res.status(400).send({
                    success: 'true',
                    statusCode: 403,
                    data: null,
                    message: constants.FAIL_DELETE_RELATION_EXIST
                });
            }
        });

    await Payment.destroy({ where: { id: id } })
        .then(() => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: null,
                message: constants.SUCCESS_DELETE_PAYMENT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_DELETE_PAYMENT
            });
        });
};
