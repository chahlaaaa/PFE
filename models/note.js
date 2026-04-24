// models/Note.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    valeur: { type: DataTypes.FLOAT }, // النقطة الفعلية
    test1: { type: DataTypes.FLOAT },
    test2: { type: DataTypes.FLOAT },
    studentId: { 
        type: DataTypes.INTEGER,
        references: { model: 'etudiant', key: 'id' }
    }
}, { tableName: 'note', timestamps: false });

module.exports = Note;