const express = require('express');
const router = express.Router();
const db = require('../config/db');

// جلب سجل الحضور لطالب معين
router.get('/:idEtudiant', (req, res) => {
    const query = "SELECT * FROM presence WHERE idEtudiant = ?";
    db.query(query, [req.params.idEtudiant], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// تسجيل حضور/غياب جديد
router.post('/', (req, res) => {
    const { idEtudiant, date, absenceJustifiee } = req.body;
    const query = "INSERT INTO presence (idEtudiant, date, absenceJustifiee) VALUES (?, ?, ?)";
    db.query(query, [idEtudiant, date, absenceJustifiee], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Présence enregistrée" });
    });
});

module.exports = router;