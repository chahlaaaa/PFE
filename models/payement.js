// models/payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    idPayment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    montant: DataTypes.FLOAT,
    date: DataTypes.DATE,
    methode: DataTypes.STRING,
    status: DataTypes.STRING
  });
  return Payment;
};