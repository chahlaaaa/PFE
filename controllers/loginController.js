const db = require('../config/db');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM compte WHERE nomUtilisateur = ? AND motDePasse = ?";
    
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects" });
        }
    });
};