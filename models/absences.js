const db = require('../config/db');

const Absence = {
    // جلب كل الغيابات مع أسماء الطلاب
    findAll: async (filters = {}) => {
        let query = `
            SELECT a.*, u.nom as eleve_nom_complet 
            FROM absences a 
            JOIN Etudiant e ON a.eleve_id = e.idEtudiant
            JOIN Utilisateur u ON e.idEtudiant = u.idUtilisateur
            WHERE 1=1`;
        const params = [];
        // يمكنك إضافة الفلاتر هنا (التاريخ، الحالة...)
        query += ' ORDER BY a.date_absence DESC';
        const [rows] = await db.query(query, params);
        return rows;
    },

    // حفظ مصفوفة غيابات (Bulk Insert)
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