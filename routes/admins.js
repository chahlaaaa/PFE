const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // موديل المدير

// جلب كل المديرين
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة مدير جديد
router.post('/', async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تعديل مدير
router.put('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    await admin.update(req.body);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف مدير
router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    await admin.destroy();
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;