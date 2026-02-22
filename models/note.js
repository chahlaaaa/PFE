// models/Note.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');
const Course = require('./cours');

const Note = sequelize.define('Note', {
  value: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: 'notes',
  timestamps: true
});

// علاقات
Note.belongsTo(Student, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Student.hasMany(Note, { foreignKey: 'studentId' });

Note.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Course.hasMany(Note, { foreignKey: 'courseId' });

module.exports = Note;