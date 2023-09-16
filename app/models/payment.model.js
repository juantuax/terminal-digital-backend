module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define("Payment", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dni: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        bank_emision: {
            type: Sequelize.STRING,
            allowNull: true
        },
        ref_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        observation: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }, {
        tableName: 'payments'
    });

    return Payment;
};