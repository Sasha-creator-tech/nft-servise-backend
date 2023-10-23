"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("NFTMeta", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            nft_ids_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "NFTIds",
                    key: "id",
                },
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("NFTMeta");
    },
};
