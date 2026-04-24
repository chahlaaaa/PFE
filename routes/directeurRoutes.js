const express = require('express');
const router = express.Router();
const directeurController = require('../controllers/directeurController');

// --- 1. إدارة الموظفين (Gérer employés) ---
// تشمل: Ajouter, Supprimer, Modifier, Consulter employés
router.get('/employes', directeurController.getStaffList); // Consulter 
router.post('/employes/ajouter', directeurController.addStaffMember); // Ajouter 
router.put('/employes/:id', directeurController.updateStaff); // Modifier 
router.delete('/employes/:id', directeurController.deleteStaff); // Supprimer 

// --- 2. إدارة الدورات/التكوينات (Gérer courses) ---
// تشمل: Ajouter course (Sélectionner prof/langue) 
router.post('/courses/ajouter', directeurController.createFormation); 
router.get('/courses', directeurController.getAllCourses);

// --- 3. الإدارة المالية (Gérer finances) ---
// تشمل: دفع الرواتب، متابعة المصاريف، والتحقق من سجل المدفوعات للموظفين

// جلب الإحصائيات المالية العامة (الأرباح مقابل الرواتب)
router.get('/finance/statistiques', directeurController.getFinancialReport); 

// تنفيذ عملية دفع راتب لموظف معين (Sélectionner employé)
router.post('/finance/payer-employe', directeurController.payEmployee); 

// التحقق من سجل مدفوعات الموظفين (Vérifier historique des paiements des employés)
router.get('/finance/verifier-paiements', directeurController.checkEmployeePayments);
module.exports = router;