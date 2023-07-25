"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("NFTIds", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            nft_token_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "NFTTokens",
                    key: "id",
                },
            },
            onchain_id: {
                type: DataTypes.INTEGER,
                unique: true,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("NFTIds");
    },
};
