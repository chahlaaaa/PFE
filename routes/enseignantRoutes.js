const express = require('express');
const router = express.Router();
// استيراد الموديلات (تأكدي من صحة المسارات لديكِ)
const Note = require('../models/Note');
const Absence = require('../models/Absence');
const Ressource = require('../models/Ressource');

// --- 1. مسار جلب كل الطلاب (لإظهارهم في الجدول) ---
router.get('/', async (req, res) => {
    try {
        // افترضنا أن لديكِ موديل اسمه Student، إذا لم يوجد استخدمي الموديل المتاح
        // const students = await Student.findAll(); 
        res.status(200).json([]); // مؤقتاً مصفوفة فارغة للتجربة
    } catch (err) {
        res.status(500).json({ error: "Erreur de récupération" });
    }
});

// --- 2. مسار تحديث النقاط ---
router.put('/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { test1, test2, test3 } = req.body;

        const [note, created] = await Note.findOrCreate({
            where: { studentId },
            defaults: { test1, test2, test3 }
        });

        if (!created) {
            await note.update({ test1, test2, test3 });
        }
        res.status(200).json({ message: "Notes mises à jour" });
    } catch (err) {
        res.status(500).json({ error: "Erreur de saisie" });
    }
});

// --- 3. مسار الغيابات ---
router.post('/absences', async (req, res) => {
    try {
        const { studentIds, date, groupeId } = req.body;
        const entries = studentIds.map(id => ({
            studentId: id,
            date,
            groupeId,
            justifiee: 'En attente'
        }));
        await Absence.bulkCreate(entries);
        res.status(201).json({ message: "Absences enregistrées" });
    } catch (err) {
        res.status(500).json({ error: "Erreur de registre" });
    }
});

// تصدير الـ router في النهاية
module.exports = router;