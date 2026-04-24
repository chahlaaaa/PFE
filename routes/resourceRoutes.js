const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query("SELECT * FROM resources", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { idCours, description, nbrChapitre, auteur, idFormation } = req.body;
    const query = "INSERT INTO resources (idCours, description, nbrChapitre, auteur, idFormation) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [idCours, description, nbrChapitre, auteur, idFormation], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

module.exports = router;