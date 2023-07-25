"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("NFTTokens", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            address: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            brand_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Brands",
                    key: "id",
                },
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("NFTTokens");
    },
};
