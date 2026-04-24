// models/Groupe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Groupe = sequelize.define('Groupe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nomGroupe: { type: DataTypes.STRING, allowNull: false },
    niveau: { type: DataTypes.STRING }, // مثال: 'A1', 'B2'
    superviseurId: { type: DataTypes.INTEGER }, // المشرف الذي أنشأ الفوج
    enseignantId: { type: DataTypes.INTEGER }, // الأستاذ المسؤول
    langueId: { type: DataTypes.INTEGER }
}, { tableName: 'groupe', timestamps: false });

module.exports = Groupe;