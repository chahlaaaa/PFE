// ============================================================
// routes/auth.js — مسارات المصادقة (تسجيل الدخول / التسجيل)
// ============================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth');

// ── تسجيل الدخول ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    // البحث عن المستخدم
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND role = ? AND actif = 1',
      [username, role]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const user = users[0];

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nom: user.nom_complet },
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
          username: user.username,
          nom: user.nom_complet,
          role: user.role,
          email: user.email,
          avatar_color: user.avatar_color
        }
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── التحقق من التوكن ──────────────────────────────────
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: { user: decoded } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'توكن غير صالح' });
  }
});

// ── إنشاء مستخدم جديد (للمدير فقط) ───────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password, nom_complet, email, telephone, role } = req.body;

    if (!username || !password || !nom_complet || !role) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }

    // التحقق من عدم وجود المستخدم
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'اسم المستخدم موجود بالفعل' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدراج المستخدم
    const [result] = await db.query(
      'INSERT INTO users (username, password, nom_complet, email, telephone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, nom_complet, email, telephone, role]
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('خطأ في إنشاء المستخدم:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── قائمة المستخدمين ──────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, nom_complet, email, telephone, role, avatar_color, actif, created_at FROM users ORDER BY id'
    );
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── تغيير كلمة المرور ─────────────────────────────────
router.put('/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('خطأ في تغيير كلمة المرور:', error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
