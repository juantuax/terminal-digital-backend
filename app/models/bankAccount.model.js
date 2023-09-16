module.exports = (sequelize, Sequelize) => {
    const BankAccount = sequelize.define("BankAccount", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bank_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        account_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        owner_ruc: {
            type: Sequelize.STRING,
            allowNull: false
        },
        owner_name: {
            type: Sequelize.STRING,
            allowNull: false
        },

    }, {
        tableName: 'bank_account'
    });

    return BankAccount;
};