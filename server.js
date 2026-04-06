const express = require('express');
const path = require('path');
const db = require('./config/db'); // ملف قاعدة البيانات الذي أنشأته سابقاً
const app = express();

app.use(express.json());
// إخبار السيرفر بمكان ملفات الواجهة
app.use(express.static(path.join(__dirname, 'public')));

// مسارات واجهات المستخدم
app.get('/enseignant', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/secretaire', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// مسار افتراضي
app.get('/', (req, res) => {
    res.redirect('/enseignant');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل بنجاح على http://localhost:${PORT}`);
});