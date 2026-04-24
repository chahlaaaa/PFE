const express = require('express');
const cors = require('cors'); // 1. أضيفي هذه المكتبة
const app = express();

// 2. تفعيل CORS للسماح لـ React بالاتصال بالسيرفر
app.use(cors()); 

// ضروري لقراءة البيانات القادمة من React
app.use(express.json());

try {
    // استيراد المسارات
    const authRoutes = require('./routes/loginRoutes');
    const etudiantRoutes = require('./routes/etudiantRoutes');
    const paymentRoutes = require('./routes/paymentRoutes');
    const groupesRoutes = require('./routes/groupesRoutes');
    const superviseurRoutes = require('./routes/superviseurRoutes');
    const enseignantRoutes = require('./routes/enseignantRoutes');
    const formationRoutes = require('./routes/formationRoutes');
    const presenceRoutes = require('./routes/presenceRoutes');
    const resourceRoutes = require('./routes/resourceRoutes'); // 3. تم إضافة الاستيراد الناقص هنا
    const dashboardRoutes = require('./routes/dashboard'); 

    // استخدام المسارات
    app.use('/api/auth', authRoutes);
    app.use('/api/students', etudiantRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/groupes', groupesRoutes);
    app.use('/api/superviseur', superviseurRoutes);
    app.use('/api/enseignant', enseignantRoutes);
    app.use('/api/formation', formationRoutes);
    app.use('/api/presence', presenceRoutes);
    app.use('/api/ressources', resourceRoutes);
    app.use('/api/dashboard', dashboardRoutes);


    // 4. مسار ترحيبي للتأكد من عمل السيرفر
    app.get('/', (req, res) => {
        res.send('<h1>School API is Running... 🚀</h1>');
    });

} catch (error) {
    console.error("❌ خطأ في تحميل أحد الملفات من مجلد routes:");
    console.error(error.message);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});