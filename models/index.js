const User = require('./user');
const Teacher = require('./teacher');
const Student = require('./student');
const Course = require('./cours');
const Pointage = require("./pointage")(sequelize, DataTypes);

Teacher.hasMany(Pointage);
Pointage.belongsTo(Teacher);

User.hasMany(Pointage); // السكريتيرة أو الإداري
Pointage.belongsTo(User);
module.exports = { User, Teacher, Student, Course };