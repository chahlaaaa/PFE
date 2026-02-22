const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

class Teacher extends Model {}

Teacher.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Teacher',
  tableName: 'teachers'
});

// كل Teacher مرتبط بـ User
Teacher.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Teacher, { foreignKey: 'userId' });

module.exports = Teacher;