const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: Sequelize.STRING,
  addressLine1: Sequelize.STRING,
  addressLine2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  postalCode: Sequelize.STRING,
  country: Sequelize.STRING,
  phone: Sequelize.STRING,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = User;
