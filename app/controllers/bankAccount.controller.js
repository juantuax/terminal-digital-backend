const db = require("../models");
const constants = require("../resources/constants");
const Payment = db.payments;
const BankAccount = db.bankAccounts;

// get all bank accounts
exports.GetAllBankAccounts = async (req, res) => {
    await BankAccount.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.BANK_ACCOUNTS_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.BANK_ACCOUNTS_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.BANK_ACCOUNTS_NOT_FOUND
            });
        });
};

// get one bank account
exports.GetOneBankAccount = async (req, res) => {
    const id = req.params.id;
    await BankAccount.findOne({ where: { id: id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.BANK_ACCOUNT_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.BANK_ACCOUNT_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.BANK_ACCOUNT_NOT_FOUND
            });
        });
};

// create a new bank account
exports.CreateBankAccount = async (req, res) => {
    const bankName = req.body.bankName;
    const accountNumber = req.body.accountNumber;
    const ownerRuc = req.body.ownerRuc;
    const ownerName = req.body.ownerName;


    if (!(bankName) || !(accountNumber) || !(ownerName) || !(ownerRuc) ) {
        return res.status(400).send({
            success: 'true',
            statusCode: 400,
            data: null,
            message: constants.EMPTY_DATA
        });
    }

    await BankAccount.create({ bank_name: bankName, account_number: accountNumber, owner_ruc: ownerRuc, owner_name: ownerName })
        .then(async data => {
            console.log(data);
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_CREATE_BANK_ACCOUNT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_CREATE_BANK_ACCOUNT
            });
        });
};

// update bank account 
exports.UpdateBankAccount = async (req, res) => {
    const id = req.params.id;
    const bankName = req.body.bankName;
    const accountNumber = req.body.accountNumber;
    const ownerRuc = req.body.ownerRuc;
    const ownerName = req.body.ownerName;


    await BankAccount.update({ bank_name: bankName, account_number: accountNumber, owner_ruc: ownerRuc, owner_name: ownerName }, { where: { id: id } })
        .then(bankData => {
            res.status(200).send({
                success: 'true',
                statusCode: 200,
                data: bankData,
                message: constants.SUCCESS_UPDATE_PRODUCT
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_PRODUCT
            });
        });
};

//delete bank account  
exports.DeleteBankAccount = async (req, res) => {
    const id = req.params.id;

    await Payment.findAll({
        where: { BankAccountId: id }
    })
        .then(async data => {
            if (data.length > 0) {
                return res.status(400).send({
                    success: 'true',
                    statusCode: 403,
                    data: null,
                    message: constants.FAIL_DELETE_RELATION_EXIST
                });
            } else {
                await BankAccount.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(200).send({
                            success: 'true',
                            statusCode: 200,
                            data: null,
                            message: constants.SUCCESS_DELETE_BANK_ACCOUNT
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            success: 'false',
                            statusCode: 500,
                            data: err,
                            message: constants.FAIL_DELETE_BANK_ACCOUNT
                        });
                    });
            }
        });

};