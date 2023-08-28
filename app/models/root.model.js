module.exports = (sequelize, Sequelize) => {
    const Root = sequelize.define("Root", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },

    }, {
        tableName: 'roots'
    });

    return Root;
};