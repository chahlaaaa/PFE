// models/Class.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'classes',
  timestamps: true
});

module.exports = Class;