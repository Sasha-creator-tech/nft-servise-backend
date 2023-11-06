"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn("Brands", "logoUrl", {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.removeColumn("Brands", "logoUrl");
    },
};
