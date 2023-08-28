module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define("Document", {
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
        tableName: 'documents'
    });

    return Document;
};