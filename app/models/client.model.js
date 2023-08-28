module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("Client", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fullname: {
            type: Sequelize.STRING
        },
        codeClient: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'client'
    });

    return Client;
};