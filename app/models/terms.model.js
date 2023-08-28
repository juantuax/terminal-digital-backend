module.exports = (sequelize, Sequelize) => {
    const Terms = sequelize.define("Terms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        version: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'terms'
    });

    return Terms;
};