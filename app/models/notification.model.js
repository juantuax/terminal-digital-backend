module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descrip: {
            type: Sequelize.STRING,
            allowNull: false
        },
        read: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'notifications'
    });

    return Notification;
};