// models/Etudiant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Etudiant = sequelize.define('Etudiant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    dateNaissance: { type: DataTypes.DATEONLY },
    adresse: { type: DataTypes.STRING },
    telephone: { type: DataTypes.STRING }
}, { tableName: 'etudiant', timestamps: false });

module.exports = Etudiant;