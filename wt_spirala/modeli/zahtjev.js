const Sequelize = require("sequelize");

module.exports = function (sequelize) {
  const Zahtjev = sequelize.define(
    "Zahtjev",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tekst: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trazeniDatum: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      odobren: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: "Zahtjev"

    },   
  );
  return Zahtjev;
};