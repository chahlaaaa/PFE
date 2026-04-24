// controllers/groupesController.js
const db = require('../config/db');

exports.getAllGroupes = async (req, res) => {
    try {
        // استعلام يجلب بيانات المجموعة مع اسم الأستاذ واسم المستوى
        const query = `
            SELECT g.*, u.nom AS nom_enseignant, n.nom_niveau 
            FROM groupes g
            LEFT JOIN enseignants e ON g.id_enseignant = e.id_enseignant
            LEFT JOIN utilisateurs u ON e.id_enseignant = u.id_utilisateur
            LEFT JOIN niveaux n ON g.id_niveau = n.id_niveau
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};