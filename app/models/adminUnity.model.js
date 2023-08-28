module.exports = (sequelize, Sequelize) => {
    const AdminDriver = sequelize.define("AdminUnity", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    }, {
        tableName: 'admin_unity'
    });

    return AdminDriver;
};