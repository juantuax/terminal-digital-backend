module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define("Session", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sessionToken: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'sessions'
    });

    return Session;
};