//users table
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userFName: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  userMName: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  userLName: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: { isEmail: true }
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  account_password: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  admin_level: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
