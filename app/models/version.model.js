module.exports = (sequelize, Sequelize) => {
    const Version = sequelize.define("Version", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'version'
    });

    return Version;
};