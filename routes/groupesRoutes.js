const express = require('express');
const router = express.Router();
const groupesController = require('../controllers/groupesController');

// جلب كل المجموعات مع أسماء الأساتذة والمستويات (عرض عام)
router.get('/', groupesController.getAllGroupes);

// جلب تفاصيل مجموعة معينة (التلاميذ المسجلين فيها)
router.get('/:id', groupesController.getGroupeDetails);

// إضافة مجموعة جديدة (صلاحية المشرف أو المدير)
router.post('/', groupesController.createGroupe);

// تحديث بيانات مجموعة (تغيير القاعة، الأستاذ، أو المشرف)
router.put('/:id', groupesController.updateGroupe);

// حذف مجموعة (عند انتهاء التكوين)
router.delete('/:id', groupesController.deleteGroupe);

module.exports = router;