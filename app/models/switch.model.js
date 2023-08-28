module.exports = (sequelize, Sequelize) => {
    const Switch = sequelize.define("Switch", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        approved: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'switchs'
    });

    return Switch;
};