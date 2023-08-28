module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("Admin", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        companyNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },

        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contact: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        latitude: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        longitude: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }

    }, {
        tableName: 'administrators'
    });

    return Admin;
};