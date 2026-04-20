// ============================================================
// routes/eleves.js — مسارات إدارة الطلاب
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب جميع الطلاب ───────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { classe, niveau, search } = req.query;

    let query = 'SELECT * FROM eleves WHERE 1=1';
    const params = [];

    if (classe && classe !== 'Toutes') {
      query += ' AND classe = ?';
      params.push(classe);
    }
    if (niveau && niveau !== 'Tous') {
      query += ' AND niveau = ?';
      params.push(niveau);
    }
    if (search) {
      query += ' AND nom LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY nom';

    const [eleves] = await db.query(query, params);
    res.json({ success: true, data: eleves });
  } catch (error) {
    console.error('خطأ في جلب الطلاب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── جلب طالب واحد ─────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [eleves] = await db.query('SELECT * FROM eleves WHERE id = ?', [req.params.id]);
    if (eleves.length === 0) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    // جلب درجات الطالب
    const [notes] = await db.query('SELECT * FROM notes WHERE eleve_id = ? ORDER BY periode', [req.params.id]);
    // جلب غياب الطالب
    const [absences] = await db.query('SELECT * FROM absences WHERE eleve_id = ? ORDER BY date_absence DESC', [req.params.id]);

    res.json({
      success: true,
      data: { ...eleves[0], notes, absences }
    });
  } catch (error) {
    console.error('خطأ في جلب الطالب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إضافة طالب جديد ───────────────────────────────────
router.post('/', authenticate, checkRole('enseignant', 'secretaire', 'directeur'), async (req, res) => {
  try {
    const { nom, initiales, couleur, niveau, classe, date_naissance, adresse, telephone_parent, nom_parent, dossier_complet } = req.body;

    // إنشاء الأحرف الأولى إذا لم يتم تحديدها
    const finalInitiales = initiales || (() => {
      const parts = nom.trim().split(' ');
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : nom.slice(0, 2).toUpperCase();
    })();

    const finalCouleur = couleur || '#7c6f9f';

    const [result] = await db.query(
      `INSERT INTO eleves (nom, initiales, couleur, niveau, classe, date_naissance, adresse, telephone_parent, nom_parent, dossier_complet)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, finalInitiales, finalCouleur, niveau || 'A1', classe || 'Groupe A1', date_naissance, adresse, telephone_parent, nom_parent, dossier_complet || 0]
    );

    const [newEleve] = await db.query('SELECT * FROM eleves WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'تم إضافة الطالب بنجاح',
      data: newEleve[0]
    });
  } catch (error) {
    console.error('خطأ في إضافة الطالب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تعديل طالب ────────────────────────────────────────
router.put('/:id', authenticate, checkRole('enseignant', 'secretaire', 'directeur'), async (req, res) => {
  try {
    const { nom, niveau, classe, date_naissance, adresse, telephone_parent, nom_parent, dossier_complet, statut } = req.body;

    const [existing] = await db.query('SELECT * FROM eleves WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    await db.query(
      `UPDATE eleves SET nom=?, niveau=?, classe=?, date_naissance=?, adresse=?, telephone_parent=?, nom_parent=?, dossier_complet=?, statut=?
       WHERE id = ?`,
      [nom, niveau, classe, date_naissance, adresse, telephone_parent, nom_parent, dossier_complet, statut, req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM eleves WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات الطالب', data: updated[0] });
  } catch (error) {
    console.error('خطأ في تعديل الطالب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── حذف طالب ──────────────────────────────────────────
router.delete('/:id', authenticate, checkRole('enseignant', 'secretaire', 'directeur'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM eleves WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    await db.query('DELETE FROM eleves WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الطالب بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الطالب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── جلب الطلاب حسب الفصل (للغياب) ───────────────────
router.get('/par-classe/:classe', authenticate, async (req, res) => {
  try {
    const [eleves] = await db.query(
      'SELECT id, nom, initiales, couleur FROM eleves WHERE classe = ? AND statut = "actif" ORDER BY nom',
      [req.params.classe]
    );
    res.json({ success: true, data: eleves });
  } catch (error) {
    console.error('خطأ في جلب طلاب الفصل:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إحصائيات الطلاب ───────────────────────────────────
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const [total] = await db.query('SELECT COUNT(*) as count FROM eleves WHERE statut = "actif"');
    const [parNiveau] = await db.query('SELECT niveau, COUNT(*) as count FROM eleves WHERE statut = "actif" GROUP BY niveau');
    const [parClasse] = await db.query('SELECT classe, COUNT(*) as count FROM eleves WHERE statut = "actif" GROUP BY classe');

    res.json({
      success: true,
      data: { total: total[0].count, parNiveau, parClasse }
    });
  } catch (error) {
    console.error('خطأ في إحصائيات الطلاب:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;