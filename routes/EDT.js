// ============================================================
// routes/edt.js — مسارات إدارة الجدول الزمني
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب الجدول الزمني ─────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { classe } = req.query;

    let query = 'SELECT * FROM emploi_du_temps WHERE 1=1';
    const params = [];

    if (classe && classe !== 'Toutes') {
      query += ' AND classe = ?';
      params.push(classe);
    }

    query += ' ORDER BY FIELD(jour, "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"), FIELD(creneau, "08:00–09:30", "10:00–11:30", "12:00–13:30", "14:00–15:30", "16:00–17:30")';

    const [edt] = await db.query(query, params);

    // تجميع حسب الفصل
    const grouped = {};
    edt.forEach(entry => {
      if (!grouped[entry.classe]) grouped[entry.classe] = {};
      if (!grouped[entry.classe][entry.jour]) grouped[entry.classe][entry.jour] = {};
      grouped[entry.classe][entry.jour][entry.creneau] = {
        matiere: entry.matiere,
        prof: entry.professeur,
        salle: entry.salle
      };
    });

    res.json({ success: true, data: classe ? (grouped[classe] || {}) : grouped });
  } catch (error) {
    console.error('خطأ في جلب الجدول الزمني:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إضافة أو تعديل خلية في الجدول ─────────────────────
router.put('/', authenticate, checkRole('enseignant', 'directeur'), async (req, res) => {
  try {
    const { classe, jour, creneau, matiere, professeur, salle } = req.body;

    if (!classe || !jour || !creneau) {
      return res.status(400).json({ success: false, message: 'الفصل واليوم والفترة الزمنية مطلوبون' });
    }

    // استخدام REPLACE أو INSERT ON DUPLICATE KEY UPDATE
    await db.query(
      `INSERT INTO emploi_du_temps (classe, jour, creneau, matiere, professeur, salle)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE matiere = ?, professeur = ?, salle = ?`,
      [classe, jour, creneau, matiere, professeur, salle, matiere, professeur, salle]
    );

    res.json({ success: true, message: 'تم تحديث الجدول الزمني' });
  } catch (error) {
    console.error('خطأ في تحديث الجدول الزمني:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── حذف خلية من الجدول ───────────────────────────────
router.delete('/', authenticate, checkRole('enseignant', 'directeur'), async (req, res) => {
  try {
    const { classe, jour, creneau } = req.body;

    if (!classe || !jour || !creneau) {
      return res.status(400).json({ success: false, message: 'الفصل واليوم والفترة الزمنية مطلوبون' });
    }

    await db.query(
      'DELETE FROM emploi_du_temps WHERE classe = ? AND jour = ? AND creneau = ?',
      [classe, jour, creneau]
    );

    res.json({ success: true, message: 'تم حذف الخلية من الجدول' });
  } catch (error) {
    console.error('خطأ في حذف خلية الجدول:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
