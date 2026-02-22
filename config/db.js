const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('school_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // أو postgres إذا تستخدمين PostgreSQL
  logging: false
});

module.exports = sequelize;