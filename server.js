const express = require('express');
const cors = require('cors');

const app = express(); // أولاً: نقوم بتعريف app

app.use(cors());       // ثانياً: نطلب من app استخدام cors
app.use(express.json()); // ثالثاً: نطلب من app فهم بيانات JSON
const absences = require('./routes/absences');
const inscriptions = require('./routes/inscriptions');
const path = require('path'); // لإدارة المسارات

// 1. مسارات الـ API (تعمل خلف الكواليس)
app.use('/api/absences', absences);
app.use('/api/inscriptions', inscriptions); 
// 2. إخبار السيرفر بمكان ملفات الواجهة (HTML, JS, CSS)
// هذا السطر سيحل مشكلة "Cannot GET /"
app.use(express.static(path.join(__dirname, 'public')));
// 3. توجيه الطلب الرئيسي لفتح ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});