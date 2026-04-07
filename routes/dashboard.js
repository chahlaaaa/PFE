// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stats', (req, res) => {
    const queries = {
        totalStudents: "SELECT COUNT(*) as count FROM Etudiant",
        pendingEvaluations: "SELECT COUNT(*) as count FROM Note WHERE valeur IS NULL",
        recentAbsences: "SELECT COUNT(*) as count FROM Presence WHERE status = 'Absent' AND date >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    };

    // تنفيذ الاستعلامات وإرسال النتائج للواجهة
    db.query(`${queries.totalStudents}; ${queries.pendingEvaluations}; ${queries.recentAbsences}`, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({
            students: results[0][0].count,
            evaluations: results[1][0].count,
            absences: results[2][0].count
        });
    });
});

module.exports = router;