// models/Compte.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ملف إعداد Sequelize

const Compte = sequelize.define('Compte', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nomUtilisateur: { type: DataTypes.STRING, unique: true, allowNull: false },
    motDePasse: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM('directeur', 'secretaire', 'enseignant', 'eleve', 'parent', 'superviseur'),
        allowNull: false 
    }
}, { tableName: 'compte', timestamps: false });

module.exports = Compte;