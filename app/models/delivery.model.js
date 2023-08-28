module.exports = (sequelize, Sequelize) => {
    const Delivery = sequelize.define("Delivery", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dateDelivery: {
            type: Sequelize.DATE,
            allowNull: false
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
        tableName: 'delivery'
    });

    return Delivery;
};