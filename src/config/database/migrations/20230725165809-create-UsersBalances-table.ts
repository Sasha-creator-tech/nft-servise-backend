"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("UsersBalances", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            nft_ids_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "NFTIds",
                    key: "id",
                },
            },
            balance: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("UsersBalances");
    },
};
