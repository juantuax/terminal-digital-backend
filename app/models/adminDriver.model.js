module.exports = (sequelize, Sequelize) => {
    const AdminDriver = sequelize.define("AdminDriver", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    }, {
        tableName: 'admin_driver'
    });

    return AdminDriver;
};