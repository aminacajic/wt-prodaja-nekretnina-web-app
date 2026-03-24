const Sequelize = require("sequelize");

module.exports = function (sequelize) {
  const Upit = sequelize.define(
    "Upit",
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
      }
    },
    {
      timestamps: false,
      tableName: "Upit"

    },
    
  );
  return Upit;
};