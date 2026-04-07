// ============================================================
// routes/absences.js — مسارات إدارة الغياب
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب جميع الغيابات ─────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { justifiee, eleve_id, date_debut, date_fin } = req.query;

    let query = 'SELECT a.*, e.nom as eleve_nom_complet, e.classe FROM absences a LEFT JOIN eleves e ON a.eleve_id = e.id WHERE 1=1';
    const params = [];

    if (justifiee && justifiee !== 'Tous') {
      query += ' AND a.justifiee = ?';
      params.push(justifiee);
    }
    if (eleve_id) {
      query += ' AND a.eleve_id = ?';
      params.push(eleve_id);
    }
    if (date_debut && date_fin) {
      query += ' AND a.date_absence BETWEEN ? AND ?';
      params.push(date_debut, date_fin);
    }

    query += ' ORDER BY a.date_absence DESC, a.created_at DESC';

    const [absences] = await db.query(query, params);
    res.json({ success: true, data: absences });
  } catch (error) {
    console.error('خطأ في جلب الغيابات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تسجيل غياب جديد ──────────────────────────────────
router.post('/', authenticate, checkRole('enseignant', 'secretaire'), async (req, res) => {
  try {
    const { absences: absencesList } = req.body; // مصفوفة من الغيابات
    const enregistre_par = req.user.id;

    if (!Array.isArray(absencesList) || absencesList.length === 0) {
      return res.status(400).json({ success: false, message: 'قائمة الغيابات مطلوبة' });
    }

    const values = absencesList.map(a => [
      a.eleve_id,
      a.eleve_nom,
      a.date_absence,
      a.seance,
      'En attente',
      enregistre_par
    ]);

    const [result] = await db.query(
      `INSERT INTO absences (eleve_id, eleve_nom, date_absence, seance, justifiee, enregistre_par)
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      success: true,
      message: `تم تسجيل ${result.affectedRows} غياب بنجاح`,
      data: { inserted: result.affectedRows }
    });
  } catch (error) {
    console.error('خطأ في تسجيل الغياب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تعديل حالة الغياب (ت justification) ──────────────
router.put('/:id', authenticate, checkRole('enseignant', 'secretaire'), async (req, res) => {
  try {
    const { justifiee, motif } = req.body;

    const [existing] = await db.query('SELECT * FROM absences WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الغياب غير موجود' });
    }

    await db.query(
      'UPDATE absences SET justifiee = ?, motif = ? WHERE id = ?',
      [justifiee, motif, req.params.id]
    );

    res.json({ success: true, message: 'تم تحديث حالة الغياب' });
  } catch (error) {
    console.error('خطأ في تحديث الغياب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── حذف غياب ──────────────────────────────────────────
router.delete('/:id', authenticate, checkRole('enseignant', 'secretaire', 'directeur'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM absences WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الغياب غير موجود' });
    }

    await db.query('DELETE FROM absences WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الغياب بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الغياب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إحصائيات الغياب ───────────────────────────────────
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const [total] = await db.query('SELECT COUNT(*) as count FROM absences');
    const [justifiees] = await db.query("SELECT COUNT(*) as count FROM absences WHERE justifiee = 'Oui'");
    const [nonJustifiees] = await db.query("SELECT COUNT(*) as count FROM absences WHERE justifiee = 'Non'");
    const [enAttente] = await db.query("SELECT COUNT(*) as count FROM absences WHERE justifiee = 'En attente'");

    // غيابات هذا الأسبوع
    const [cetteSemaine] = await db.query(
      "SELECT COUNT(*) as count FROM absences WHERE date_absence >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
    );

    res.json({
      success: true,
      data: {
        total: total[0].count,
        justifiees: justifiees[0].count,
        nonJustifiees: nonJustifiees[0].count,
        enAttente: enAttente[0].count,
        cetteSemaine: cetteSemaine[0].count
      }
    });
  } catch (error) {
    console.error('خطأ في إحصائيات الغياب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
