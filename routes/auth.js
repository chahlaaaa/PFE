const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth');

// ── 1. تسجيل الدخول (Login) ──────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    // البحث في جدول utilisateurs الجديد واستخدام nom_utilisateur
    const [users] = await db.query(
      'SELECT * FROM utilisateurs WHERE nom_utilisateur = ? AND role = ?',
      [username, role]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'المستخدم غير موجود أو الدور غير صحيح' });
    }

    const user = users[0];

    // التحقق من كلمة المرور (ملاحظة: إذا كانت الكلمة في القاعدة غير مشفرة استخدم المقارنة العادية)
    // const isMatch = await bcrypt.compare(password, user.mot_de_passe); 
    const isMatch = (password === user.mot_de_passe); 

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { id: user.id, username: user.nom_utilisateur, role: user.role, nom: user.nom_complet },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          id: user.id,
          username: user.nom_utilisateur,
          nom: user.nom_complet,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── 2. إنشاء مستخدم جديد (Register) ──────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password, nom_complet, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'جميع الحقول الأساسية مطلوبة' });
    }

    // التحقق من عدم تكرار اسم المستخدم في الجدول الجديد
    const [existing] = await db.query('SELECT id FROM utilisateurs WHERE nom_utilisateur = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'اسم المستخدم موجود بالفعل' });
    }

    // إدراج البيانات في جدول utilisateurs
    const [result] = await db.query(
      'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, nom_complet, role) VALUES (?, ?, ?, ?)',
      [username, password, nom_complet, role]
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('خطأ في إنشاء المستخدم:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── 3. جلب قائمة المستخدمين ──────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, nom_utilisateur, nom_complet, role, created_at FROM utilisateurs ORDER BY id DESC'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;