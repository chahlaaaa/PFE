// models/Programme.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Programme = sequelize.define('Programme', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nomProgramme: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    prix: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // سعر الدورة
    duree: { type: DataTypes.STRING } // مثلاً: '3 mois'
}, { tableName: 'programme', timestamps: false });

module.exports = Programme;