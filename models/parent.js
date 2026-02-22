// models/Parent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Student = require('./student');

const Parent = sequelize.define('Parent', {}, {
  tableName: 'parents',
  timestamps: true
});

// علاقات
Parent.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Parent, { foreignKey: 'userId' });

Parent.hasMany(Student, { foreignKey: 'parentId' });
Student.belongsTo(Parent, { foreignKey: 'parentId' });

module.exports = Parent;