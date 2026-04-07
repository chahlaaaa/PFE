// ============================================================
// config/auth.js — إعدادات المصادقة JWT
// ============================================================

require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'subul_najah_academy_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
};
