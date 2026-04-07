// ============================================================
// routes/cours.js — مسارات إدارة الدروس والموارد
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب جميع الدروس ───────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { matiere, classe, search } = req.query;

    let query = 'SELECT c.*, u.nom_complet as enseignant_nom FROM cours c LEFT JOIN users u ON c.enseignant_id = u.id WHERE 1=1';
    const params = [];

    if (matiere && matiere !== 'Tous') {
      query += ' AND c.matiere = ?';
      params.push(matiere);
    }
    if (classe && classe !== 'Toutes') {
      query += ' AND c.classe = ?';
      params.push(classe);
    }
    if (search) {
      query += ' AND (c.titre LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY c.date_cours DESC';

    const [cours] = await db.query(query, params);
    res.json({ success: true, data: cours });
  } catch (error) {
    console.error('خطأ في جلب الدروس:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── جلب درس واحد ──────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [cours] = await db.query(
      'SELECT c.*, u.nom_complet as enseignant_nom FROM cours c LEFT JOIN users u ON c.enseignant_id = u.id WHERE c.id = ?',
      [req.params.id]
    );
    if (cours.length === 0) {
      return res.status(404).json({ success: false, message: 'الدرس غير موجود' });
    }
    res.json({ success: true, data: cours[0] });
  } catch (error) {
    console.error('خطأ في جلب الدرس:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إضافة درس جديد ───────────────────────────────────
router.post('/', authenticate, checkRole('enseignant', 'directeur'), async (req, res) => {
  try {
    const { titre, matiere, classe, date_cours, description, fichier } = req.body;
    const enseignant_id = req.user.id;

    const [result] = await db.query(
      `INSERT INTO cours (titre, matiere, classe, date_cours, description, fichier, enseignant_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titre, matiere, classe, date_cours, description, fichier, enseignant_id]
    );

    const [newCours] = await db.query('SELECT * FROM cours WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'تم إضافة الدرس بنجاح',
      data: newCours[0]
    });
  } catch (error) {
    console.error('خطأ في إضافة الدرس:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تعديل درس ─────────────────────────────────────────
router.put('/:id', authenticate, checkRole('enseignant', 'directeur'), async (req, res) => {
  try {
    const { titre, matiere, classe, date_cours, description, fichier } = req.body;

    const [existing] = await db.query('SELECT * FROM cours WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الدرس غير موجود' });
    }

    await db.query(
      `UPDATE cours SET titre=?, matiere=?, classe=?, date_cours=?, description=?, fichier=?
       WHERE id = ?`,
      [titre, matiere, classe, date_cours, description, fichier, req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM cours WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث الدرس', data: updated[0] });
  } catch (error) {
    console.error('خطأ في تعديل الدرس:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── حذف درس ───────────────────────────────────────────
router.delete('/:id', authenticate, checkRole('enseignant', 'directeur'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM cours WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'الدرس غير موجود' });
    }

    await db.query('DELETE FROM cours WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الدرس بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الدرس:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;