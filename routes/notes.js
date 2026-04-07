// ============================================================
// routes/notes.js — مسارات إدارة الدرجات / النتائج
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب درجات طالب ────────────────────────────────────
router.get('/eleve/:eleveId', authenticate, async (req, res) => {
  try {
    const [notes] = await db.query(
      'SELECT * FROM notes WHERE eleve_id = ? ORDER BY periode',
      [req.params.eleveId]
    );
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('خطأ في جلب الدرجات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تسجيل درجات ──────────────────────────────────────
router.post('/', authenticate, checkRole('enseignant'), async (req, res) => {
  try {
    const { eleve_id, test1, test2, test3, periode } = req.body;
    const enregistre_par = req.user.id;

    // حساب المعدل
    const valides = [test1, test2, test3].filter(v => v !== null && v !== undefined);
    const moyenne = valides.length > 0
      ? (valides.reduce((a, b) => a + Number(b), 0) / valides.length).toFixed(2)
      : null;

    const [result] = await db.query(
      `INSERT INTO notes (eleve_id, test1, test2, test3, moyenne, periode, enregistre_par)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE test1 = ?, test2 = ?, test3 = ?, moyenne = ?, enregistre_par = ?`,
      [eleve_id, test1, test2, test3, moyenne, periode || 'Semestre 1', enregistre_par,
       test1, test2, test3, moyenne, enregistre_par]
    );

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الدرجات بنجاح',
      data: { moyenne }
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدرجات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تحديث درجات ──────────────────────────────────────
router.put('/:id', authenticate, checkRole('enseignant'), async (req, res) => {
  try {
    const { test1, test2, test3 } = req.body;

    const valides = [test1, test2, test3].filter(v => v !== null && v !== undefined);
    const moyenne = valides.length > 0
      ? (valides.reduce((a, b) => a + Number(b), 0) / valides.length).toFixed(2)
      : null;

    await db.query(
      'UPDATE notes SET test1=?, test2=?, test3=?, moyenne=? WHERE id = ?',
      [test1, test2, test3, moyenne, req.params.id]
    );

    res.json({ success: true, message: 'تم تحديث الدرجات', data: { moyenne } });
  } catch (error) {
    console.error('خطأ في تحديث الدرجات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;