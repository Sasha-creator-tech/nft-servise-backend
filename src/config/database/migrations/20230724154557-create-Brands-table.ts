"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("Brands", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            url: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("Brands");
    },
};
