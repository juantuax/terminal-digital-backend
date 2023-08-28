module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        verified: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        rol: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        notificationToken: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'users'
    });

    return User;
};