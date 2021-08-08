"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Board.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
      },
      nickname: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Board",
    }
  );
  return Board;
};
