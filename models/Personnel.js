// models/Personnel.js (للمدير والمشرفين)
const Personnel = sequelize.define('Personnel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING },
    prenom: { type: DataTypes.STRING },
    telephone: { type: DataTypes.STRING },
    typePersonnel: { type: DataTypes.ENUM('directeur', 'superviseur', 'secretaire') },
    compteId: { type: DataTypes.INTEGER } // الربط مع حساب تسجيل الدخول
}, { tableName: 'personnel', timestamps: false });