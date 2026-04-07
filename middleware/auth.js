// ============================================================
// middleware/auth.js — وسيط المصادقة JWT
// ============================================================

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

// التحقق من صحة التوكن
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير مصرح - يرجى تسجيل الدخول' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'انتهت صلاحية الجلسة - يرجى تسجيل الدخول مجدداً' });
    }
    return res.status(401).json({ success: false, message: 'توكن غير صالح' });
  }
}

// التحقق من الدور
function checkRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'غير مصرح' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'ليس لديك صلاحية لهذا الإجراء' });
    }
    next();
  };
}

module.exports = { authenticate, checkRole };
