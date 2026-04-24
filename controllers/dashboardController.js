const db = require('../config/db');

exports.getStats = (req, res) => {
    const queries = {
        totalStudents: "SELECT COUNT(*) as count FROM Etudiant",
        pendingEvaluations: "SELECT COUNT(*) as count FROM Note WHERE valeur IS NULL",
        recentAbsences: "SELECT COUNT(*) as count FROM Presence WHERE status = 'Absent' AND date >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    };

    // ملاحظة: لتنفيذ استعلامات متعددة في سطر واحد، تأكدي أن إعدادات MySQL تسمح بـ multipleStatements: true
    const combinedQuery = `${queries.totalStudents}; ${queries.pendingEvaluations}; ${queries.recentAbsences}`;

    db.query(combinedQuery, (err, results) => {
        if (err) {
            console.error("Dashboard Stats Error:", err);
            return res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
        }

        // إرسال البيانات بشكل منظم للواجهة
        res.json({
            students: results[0][0].count,
            evaluations: results[1][0].count,
            absences: results[2][0].count
        });
    });
};