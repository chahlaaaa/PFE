const db = require('../config/db');

const Note = {
    getLatestNotes: async (limit = 5) => {
        const query = `
            SELECT u.nom, n.valeur, c.nomCours
            FROM Note n
            JOIN Etudiant e ON n.idEtudiant = e.idEtudiant
            JOIN Utilisateur u ON e.idEtudiant = u.idUtilisateur
            JOIN Cours c ON n.idCours = c.idCours
            ORDER BY n.idNote DESC LIMIT ?`;
        const [rows] = await db.query(query, [limit]);
        return rows;
    }
};

module.exports = Note;