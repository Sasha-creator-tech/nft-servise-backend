"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn("Brands", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("Brands", "updatedAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTTokens", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTTokens", "updatedAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTIds", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTIds", "updatedAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTMeta", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("NFTMeta", "updatedAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("Users", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("Users", "updatedAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("UsersBalances", "createdAt", {
            type: DataTypes.DATE,
        });
        await queryInterface.addColumn("UsersBalances", "updatedAt", {
            type: DataTypes.DATE,
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn("Brands", "createdAt");
        await queryInterface.removeColumn("Brands", "updatedAt");
        await queryInterface.removeColumn("NFTTokens", "createdAt");
        await queryInterface.removeColumn("NFTTokens", "updatedAt");
        await queryInterface.removeColumn("NFTIds", "createdAt");
        await queryInterface.removeColumn("NFTIds", "updatedAt");
        await queryInterface.removeColumn("NFTMeta", "createdAt");
        await queryInterface.removeColumn("NFTMeta", "updatedAt");
        await queryInterface.removeColumn("Users", "createdAt");
        await queryInterface.removeColumn("Users", "updatedAt");
        await queryInterface.removeColumn("UsersBalances", "createdAt");
        await queryInterface.removeColumn("UsersBalances", "updatedAt");
    },
};
