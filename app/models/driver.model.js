module.exports = (sequelize, Sequelize) => {
    const Driver = sequelize.define("Driver", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        plates: {
            type: Sequelize.STRING,
            allowNull: true
        },
        transportLine: {
            type: Sequelize.STRING,
            allowNull: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        trial: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'drivers'
    });

    return Driver;
};