const db = require('../config/db');

const Absence = {
    // جلب الغيابات مع ربط الجداول (Joins)
    findAll: async () => {
        const query = `
            SELECT a.*, u.nom as eleve_nom_complet 
            FROM absences a 
            JOIN Etudiant e ON a.eleve_id = e.idEtudiant
            JOIN Utilisateur u ON e.idEtudiant = u.idUtilisateur
            ORDER BY a.date_absence DESC`;
        const [rows] = await db.query(query);
        return rows;
    },

    // تسجيل مصفوفة غيابات دفعة واحدة
    createMany: async (absencesList, adminId) => {
        const sql = `INSERT INTO absences 
            (eleve_id, eleve_nom, date_absence, seance, justifiee, enregistre_par) 
            VALUES ?`;
        
        const values = absencesList.map(a => [
            a.eleve_id,
            a.eleve_nom,
            a.date_absence,
            a.seance,
            'En attente',
            adminId
        ]);

        const [result] = await db.query(sql, [values]);
        return result;
    }
};

module.exports = Absence;