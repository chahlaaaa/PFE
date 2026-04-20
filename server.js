const express = require('express');
const path = require('path'); // أضف هذا السطر في الأعلى
const app = express();
const absenceRoutes = require('./routes/absences');

app.use(express.json());

// 1. مسارات الـ API (تعمل خلف الكواليس)
app.use('/api/absences', absenceRoutes);

// 2. إخبار السيرفر بمكان ملفات الواجهة (HTML, JS, CSS)
// هذا السطر سيحل مشكلة "Cannot GET /"
app.use(express.static(path.join(__dirname, 'public')));
// 3. توجيه الطلب الرئيسي لفتح ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});