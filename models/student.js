const db = require('../config/db');

const Student = {
    findByClasse: async (classeName) => {
        const query = `
            SELECT e.idEtudiant as id, u.nom, u.email 
            FROM Etudiant e
            JOIN Utilisateur u ON e.idEtudiant = u.idUtilisateur
            JOIN Groupe g ON ... -- اربطها حسب جدول المجموعات لديك
            WHERE g.nomGroupe = ?`;
        const [rows] = await db.query(query, [classeName]);
        return rows;
    }
};

module.exports = Student;