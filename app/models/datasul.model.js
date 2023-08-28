module.exports = (sequelize, Sequelize) => {
  const Datasul = sequelize.define(
    "Datasul",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      referralNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateDelivery: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "datasul",
    }
  );

  return Datasul;
};
