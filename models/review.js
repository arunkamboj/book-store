const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Review = sequelize.define("review", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Review;
