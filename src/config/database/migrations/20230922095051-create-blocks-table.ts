"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(
            "ScannedBlocks",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                },
                chainId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: process.env.CHAIN_ID,
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "0x00",
                },
                scannedBlocks: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE,
            },
            {
                uniqueKeys: {
                    uniqueCollection: {
                        fields: ["chainId", "address"],
                    },
                },
            },
        );
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("ScannedBlocks");
    },
};
