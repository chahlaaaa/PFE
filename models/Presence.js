// models/Presence.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Presence = sequelize.define('Presence', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('Present', 'Absent', 'Retard'), defaultValue: 'Present' },
    studentId: { type: DataTypes.INTEGER },
    groupeId: { type: DataTypes.INTEGER }
}, { tableName: 'presence', timestamps: false });

module.exports = Presence;