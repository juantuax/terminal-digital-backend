module.exports = (sequelize, Sequelize) => {
    const Unity = sequelize.define("Unity", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unityNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        unityName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        model: {
            type: Sequelize.STRING,
            allowNull: true
        },
        year: {
            type: Sequelize.STRING,
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }, 
        unityPlaces: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'unities'
    });

    return Unity;
};