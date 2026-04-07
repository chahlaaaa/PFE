const express = require('express');
const router = express.Router();
const Absence = require('../models/absences'); // تأكد من صحة مسار الموديل

// 1. جلب الغيابات (للتأكد من أن المسار يعمل)
router.get('/', async (req, res) => {
    try {
        const data = await Absence.findAll();
        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Error fetching:", error);
        res.status(500).json({ success: false, message: 'خطأ في جلب البيانات' });
    }
});

// 2. تسجيل الغيابات (الذي تطلبه الواجهة عند الضغط على Enregistrer)
router.post('/', async (req, res) => {
    try {
        const { absences: absencesList } = req.body;
        
        if (!absencesList || absencesList.length === 0) {
            return res.status(400).json({ success: false, message: 'قائمة الغيابات فارغة' });
        }

        // ملاحظة: استبدلنا req.user.id بـ 1 مؤقتاً للتجربة بدون تسجيل دخول
        const result = await Absence.createMany(absencesList, 1);
        
        res.status(201).json({
            success: true,
            message: `تم تسجيل ${absencesList.length} غياب بنجاح في قاعدة البيانات`
        });
    } catch (error) {
        console.error("Error saving:", error);
        res.status(500).json({ success: false, message: 'فشل الحفظ في قاعدة البيانات' });
    }
});

module.exports = router;