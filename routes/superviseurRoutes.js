const express = require('express');
const router = express.Router();
const superviseurController = require('../controllers/superviseurController');
// المشرف هو المسؤول عن إنشاء حسابات الجميع (بما في ذلك المدير)
router.post('/comptes/creer', superviseurController.createAccount);
router.patch('/comptes/:id/statut', superviseurController.toggleAccountStatus);

// --- إدارة الحسابات (Gérer comptes) ---
router.get('/comptes', superviseurController.getAllAccounts);
router.post('/comptes/creer', superviseurController.createAccount);
router.patch('/comptes/:nomUtilisateur/statut', superviseurController.toggleAccountStatus);

// --- إدارة البرامج الزمنية (Gérer programme) ---
router.get('/programmes', superviseurController.getAllProgrammes);
router.post('/programmes/creer', superviseurController.createProgramme);
router.put('/programmes/:id', superviseurController.updateProgramme);
router.delete('/programmes/:id', superviseurController.deleteProgramme);

// --- إدارة غيابات الموظفين (Gérer absence des employés) ---

// 1. جلب قائمة الموظفين فقط (الأساتذة، السكرتارية، المشرفين)
// يستخدم الدالة التي تصفي الأدوار لمنع اختيار الطلاب بالخطأ
router.get('/employes/liste', superviseurController.getEmployeesForAbsence);

// 2. تسجيل غياب موظف في جدول presence_employe الجديد
router.post('/employes/marquer-absence', superviseurController.markEmployeeAbsence);

// --- إدارة غيابات الطلاب (Gérer absence des étudiants) ---

// تسجيل غياب طالب في جدول presence التقليدي
router.post('/etudiants/marquer-absence', superviseurController.markAbsence);

// جلب سجل غيابات طالب معين
router.get('/etudiants/absences/:idEtudiant', superviseurController.getStudentAbsences);

module.exports = router;