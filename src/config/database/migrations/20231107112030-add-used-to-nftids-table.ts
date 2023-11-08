"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn("NFTIds", "isUsed", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn("NFTIds", "isUsed");
    },
};
