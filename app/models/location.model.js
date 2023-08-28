module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("Location", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        latitude: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        longitude: {
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    }, {
        tableName: 'locations'
    });

    return Location;
};