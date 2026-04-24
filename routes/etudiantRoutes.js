const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');

// --- مسارات الإدارة (للسكرتيرة والمشرف) ---

// تسجيل طالب جديد (وظيفة السكرتيرة: inscrire Etudiant)
router.post('/register', etudiantController.registerEtudiant);

// جلب قائمة كل الطلاب (وظيفة المشرف: gérer Groupe)
router.get('/', etudiantController.getAllEtudiants);

// تحديث مجموعة ومستوى الطالب (وظيفة المشرف: modifier Etudiant)
router.put('/:id/level', etudiantController.updateEtudiantLevel);

// حذف طالب من النظام
router.delete('/:id', etudiantController.deleteEtudiant);


// --- مسارات خاصة ببيانات الطالب (للمشرف والأستاذ والطالب نفسه) ---

// جلب الملف الشخصي للطالب (وظيفة: obtenir Info)
router.get('/:id/profile', etudiantController.getEtudiantProfile);

// جلب نقاط الطالب (وظيفة المشرف: voir Note / وظيفة الطالب: voir Note)
router.get('/:id/notes', etudiantController.getEtudiantNotes);

// جلب سجل حضور الطالب (وظيفة: voir Présence)
router.get('/:id/presence', etudiantController.getEtudiantPresence);

module.exports = router;