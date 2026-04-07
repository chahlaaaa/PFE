const mysql = require('mysql2/promise'); // استخدام نسخة الـ promise

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // اتركها فارغة إذا كنت تستخدم XAMPP الافتراضي
    database: 'school_app' // تأكد أن هذا هو اسم قاعدة بياناتك
});

// بدلاً من db.connect، نستخدم هذا الكود للتأكد من الاتصال
async function checkConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ متصل بقاعدة البيانات بنجاح!');
        connection.release(); // إعادة الاتصال للمسبح (Pool)
    } catch (err) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
    }
}

checkConnection();

module.exports = db;