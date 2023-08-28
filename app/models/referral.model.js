module.exports = (sequelize, Sequelize) => {
    const Referral = sequelize.define("Referral", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        referralNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        executive: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dateIssue: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        latitude: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        longitude: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        transportLine: {
            type: Sequelize.STRING,
            allowNull: false
        },
        flag: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        requestTime: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        pendingDatasul: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        observation: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }, {
        tableName: 'referrals'
    });

    return Referral;
};