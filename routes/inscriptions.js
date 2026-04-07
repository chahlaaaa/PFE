// ============================================================
// routes/inscriptions.js — مسارات إدارة التسجيلات
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, checkRole } = require('../middleware/auth');

// ── جلب جميع التسجيلات ────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { statut, search } = req.query;

    let query = `
      SELECT i.*, u.nom_complet as traite_par_nom
      FROM inscriptions i
      LEFT JOIN users u ON i.traite_par = u.id
      WHERE 1=1
    `;
    const params = [];

    if (statut && statut !== 'Tous') {
      query += ' AND i.statut = ?';
      params.push(statut);
    }
    if (search) {
      query += ' AND (i.prenom LIKE ? OR i.nom_famille LIKE ? OR i.telephone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY i.date_demande DESC';

    const [inscriptions] = await db.query(query, params);
    res.json({ success: true, data: inscriptions });
  } catch (error) {
    console.error('خطأ في جلب التسجيلات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إضافة تسجيل جديد ─────────────────────────────────
router.post('/', authenticate, checkRole('secretaire', 'directeur'), async (req, res) => {
  try {
    const { prenom, nom_famille, date_naissance, niveau_demande, nom_parent, telephone, adresse, dossier_complet, documents_manquants } = req.body;

    const [result] = await db.query(
      `INSERT INTO inscriptions (prenom, nom_famille, date_naissance, niveau_demande, nom_parent, telephone, adresse, dossier_complet, documents_manquants)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [prenom, nom_famille, date_naissance, niveau_demande, nom_parent, telephone, adresse, dossier_complet, documents_manquants]
    );

    const [newIns] = await db.query('SELECT * FROM inscriptions WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'تم إضافة التسجيل بنجاح',
      data: newIns[0]
    });
  } catch (error) {
    console.error('خطأ في إضافة التسجيل:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تحديث حالة التسجيل ───────────────────────────────
router.put('/:id', authenticate, checkRole('secretaire', 'directeur'), async (req, res) => {
  try {
    const { statut, dossier_complet, documents_manquants, niveau_demande } = req.body;
    const traite_par = req.user.id;

    const [existing] = await db.query('SELECT * FROM inscriptions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'التسجيل غير موجود' });
    }

    await db.query(
      `UPDATE inscriptions SET statut = ?, dossier_complet = ?, documents_manquants = ?, niveau_demande = ?, traite_par = ?, date_traitement = NOW()
       WHERE id = ?`,
      [statut, dossier_complet, documents_manquants, niveau_demande, traite_par, req.params.id]
    );

    // إذا تم التحقق من التسجيل، إنشاء حساب طالب
    if (statut === 'valide' && existing[0].statut !== 'valide') {
      const nom_complet = `${existing[0].prenom} ${existing[0].nom_famille}`;
      const initiales = (existing[0].prenom[0] + existing[0].nom_famille[0]).toUpperCase();
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);

      await db.query(
        `INSERT INTO eleves (nom, initiales, couleur, niveau, classe, nom_parent, telephone_parent, adresse, dossier_complet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nom_complet, initiales, '#7c6f9f', niveau_demande || existing[0].niveau_demande,
          `Groupe ${niveau_demande || existing[0].niveau_demande}`, existing[0].nom_parent,
          existing[0].telephone, existing[0].adresse, 1
        ]
      );
    }

    res.json({ success: true, message: 'تم تحديث التسجيل' });
  } catch (error) {
    console.error('خطأ في تحديث التسجيل:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── حذف تسجيل ─────────────────────────────────────────
router.delete('/:id', authenticate, checkRole('secretaire', 'directeur'), async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM inscriptions WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'التسجيل غير موجود' });
    }

    await db.query('DELETE FROM inscriptions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف التسجيل بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف التسجيل:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── إحصائيات التسجيلات ───────────────────────────────
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const [total] = await db.query('SELECT COUNT(*) as count FROM inscriptions');
    const [enAttente] = await db.query("SELECT COUNT(*) as count FROM inscriptions WHERE statut = 'en_attente'");
    const [valide] = await db.query("SELECT COUNT(*) as count FROM inscriptions WHERE statut = 'valide'");
    const [ceMois] = await db.query(
      'SELECT COUNT(*) as count FROM inscriptions WHERE MONTH(date_demande) = MONTH(CURRENT_DATE()) AND YEAR(date_demande) = YEAR(CURRENT_DATE())'
    );

    res.json({
      success: true,
      data: {
        total: total[0].count,
        enAttente: enAttente[0].count,
        valide: valide[0].count,
        ceMois: ceMois[0].count
      }
    });
  } catch (error) {
    console.error('خطأ في إحصائيات التسجيلات:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
