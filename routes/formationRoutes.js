const express = require('express');
const router = express.Router();
const db = require('../config/db');

// جلب التكوينات المتاحة (English, French, etc.)
router.get('/', (req, res) => {
    db.query("SELECT * FROM formation", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;