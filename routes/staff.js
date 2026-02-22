const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');

// جلب كل المسؤولين
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة مسؤول جديد
router.post('/', async (req, res) => {
  try {
    const s = await Staff.create(req.body);
    res.json(s);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تعديل مسؤول
router.put('/:id', async (req, res) => {
  try {
    const s = await Staff.findByPk(req.params.id);
    if (!s) return res.status(404).json({ error: 'Staff not found' });

    await s.update(req.body);
    res.json(s);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف مسؤول
router.delete('/:id', async (req, res) => {
  try {
    const s = await Staff.findByPk(req.params.id);
    if (!s) return res.status(404).json({ error: 'Staff not found' });

    await s.destroy();
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;