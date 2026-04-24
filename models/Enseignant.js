// models/Enseignant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enseignant = sequelize.define('Enseignant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    specialite: { type: DataTypes.STRING },
    langueId: { 
        type: DataTypes.INTEGER,
        references: { model: 'langue', key: 'id' }
    }
}, { tableName: 'enseignant', timestamps: false });

module.exports = Enseignant;