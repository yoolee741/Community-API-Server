"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("likeData", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isLike: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      post_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("likeData");
  },
};
