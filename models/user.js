const db = require('../config/db');

const User = {
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM Utilisateur WHERE idUtilisateur = ?', [id]);
        return rows[0];
    },
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
        return rows[0];
    },
    getRole: async (username) => {
        const [rows] = await db.query('SELECT role FROM Compte WHERE nomUtilisateur = ?', [username]);
        return rows[0];
    }
};

module.exports = User;