const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

class Student extends Model {}

Student.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students'
});

// كل Student مرتبط بـ User
Student.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Student, { foreignKey: 'userId' });

module.exports = Student;