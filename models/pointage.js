module.exports = (sequelize, DataTypes) => {
  const Pointage = sequelize.define("Pointage", {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    heureArrivee: {
      type: DataTypes.TIME,
      allowNull: false
    },
    remarque: {
      type: DataTypes.STRING
    }
  });

  return Pointage;
};