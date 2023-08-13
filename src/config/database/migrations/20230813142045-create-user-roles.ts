"use strict";

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("UserRoles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.STRING,
        unique: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    await queryInterface.addColumn("Users", "roleId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      onDelete: "SET NULL",
      references: {
        model: "UserRoles",
        key: "id"
      }
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("UserRoles");
    await queryInterface.removeColumn("Users", "roleId")
  },
};
