// models/Ressource.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ressource = sequelize.define('Ressource', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titre: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING }, // 'PDF', 'Vidéo', 'Exercice'
    fichierUrl: { type: DataTypes.STRING }, // رابط الملف في السيرفر
    groupeId: { type: DataTypes.INTEGER }, // الفوج المستهدف
    enseignantId: { type: DataTypes.INTEGER } // من رفع الملف
}, { tableName: 'ressource', timestamps: false });

module.exports = Ressource;