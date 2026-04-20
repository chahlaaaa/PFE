// models/student.js
const db = require('../config/db');

const Student = {
    // جلب الطلاب حسب اسم الفوج (مثل Groupe A1)
    findByClasse: async (classeName) => {
        const query = `
            SELECT u.idUtilisateur as id, u.nom, u.email, e.matricule
            FROM Utilisateur u
            JOIN Etudiant e ON u.idUtilisateur = e.idEtudiant
            JOIN inscription i ON e.idEtudiant = i.idEtudiant
            JOIN Groupe g ON i.idGroupe = g.idGroupe
            WHERE g.nomGroupe = ?`;
        
        const [rows] = await db.query(query, [classeName]);
        return rows;
    },

    // إضافة طالب جديد (الذي تحتاجه في صفحة Inscriptions)
    create: async (studentData) => {
        const sql = "INSERT INTO Etudiant (idEtudiant, matricule, idParent) VALUES (?, ?, ?)";
        return await db.query(sql, [studentData.id, studentData.matricule, studentData.idParent]);
    }
};

module.exports = Student;