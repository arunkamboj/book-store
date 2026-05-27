const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  totalAmount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'CREATED'
  },
  paymentId: Sequelize.STRING,
  paymentStatus: Sequelize.STRING,
  payerEmail: Sequelize.STRING,
  customerName: Sequelize.STRING,
  addressLine1: Sequelize.STRING,
  addressLine2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  postalCode: Sequelize.STRING,
  country: Sequelize.STRING,
  phone: Sequelize.STRING
})

module.exports = Order;
