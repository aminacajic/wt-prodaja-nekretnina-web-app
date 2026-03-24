const Sequelize = require("sequelize");
module.exports = function (sequelize) {
  const Nekretnina = sequelize.define(
    "Nekretnina",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tip_nekretnine: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      naziv: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tip_grijanja: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lokacija: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      opis: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      godina_izgradnje: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kvadratura: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cijena: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      datum_objave: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "Nekretnina"

    },
    
  );
  return Nekretnina;
};