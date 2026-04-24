// models/Langue.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const formation = sequelize.define('Formation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false } // مثال: 'Informatique', 'Mathématiques'
}, { tableName: 'formation', timestamps: false });

module.exports = formation;