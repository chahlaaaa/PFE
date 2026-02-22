// models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  method: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'payments',
  timestamps: true
});

// علاقات
Payment.belongsTo(Student, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Student.hasMany(Payment, { foreignKey: 'studentId' });

module.exports = Payment;