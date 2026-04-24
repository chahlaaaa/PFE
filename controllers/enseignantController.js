const Note = require('../models/Note');
const Absence = require('../models/Absence');

// 1. تحديث أو إضافة نقطة طالب
exports.updateNote = async (req, res) => {
    try {
        const { studentId, testField, value } = req.body; // testField قد يكون test1 أو test2
        const note = await Note.upsert({ studentId, [testField]: value });
        res.status(200).json({ message: "Note mise à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. تسجيل غياب مجموعة
exports.markAbsence = async (req, res) => {
    try {
        const { students, date, sessionId } = req.body;
        // يتم إدخال قائمة الطلاب الغائبين فقط
        await Absence.bulkCreate(students.map(id => ({ studentId: id, date, sessionId })));
        res.status(201).json({ message: "Absences enregistrées" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};