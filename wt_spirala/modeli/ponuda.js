const Sequelize = require("sequelize");

module.exports = function (sequelize) {
    const Ponuda = sequelize.define(
        "Ponuda",
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
            cijenaPonude: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            datumPonude: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            odbijenaPonuda: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: false,
            tableName: "Ponuda"

        }, 
    );

    return Ponuda;
};