"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_address: {
                type: DataTypes.STRING,
                unique: true,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("Users");
    },
};
