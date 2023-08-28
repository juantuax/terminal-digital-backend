module.exports = (sequelize, Sequelize) => {
    const Picture = sequelize.define("Picture", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        path: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'pictures'
    });

    return Picture;
};