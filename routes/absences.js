const express = require('express');
const router = express.Router();
const Absence = require('../models/Absence'); // استدعاء الموديل الجديد
const { authenticate, checkRole } = require('../middleware/auth');

// 1. جلب الغيابات (بدلاً من كتابة SQL طويلة هنا)
router.get('/', authenticate, async (req, res) => {
    try {
        const absences = await Absence.findAll(req.query); // نستخدم الموديل
        res.json({ success: true, data: absences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في جلب البيانات' });
    }
});

// 2. تسجيل غياب جديد (استخدام createMany من الموديل)
router.post('/', authenticate, checkRole('enseignant', 'secretaire'), async (req, res) => {
    try {
        const { absences: absencesList } = req.body;
        const result = await Absence.createMany(absencesList, req.user.id);
        
        res.status(201).json({
            success: true,
            message: `تم تسجيل ${result.affectedRows} غياب بنجاح`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'فشل الحفظ في قاعدة البيانات' });
    }
});

// يمكنك ترك مسارات الـ PUT والـ DELETE كما هي أو تحويلها للموديل لاحقاً
module.exports = router;