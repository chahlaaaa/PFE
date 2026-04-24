// models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    montant: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    datePaiement: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    methode: { type: DataTypes.ENUM('Espèces', 'Carte', 'Virement') },
    statut: { type: DataTypes.ENUM('Payé', 'Partiel', 'En attente') },
    etudiantId: { type: DataTypes.INTEGER }
}, { tableName: 'payment', timestamps: false });

module.exports = Payment;