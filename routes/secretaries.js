const express = require('express');
const router = express.Router();
const Secretary = require('../models/secretary');

// جلب كل السكريتيرات
router.get('/', async (req, res) => {
  try {
    const sec = await Secretary.findAll();
    res.json(sec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة سكريتيرة جديدة
router.post('/', async (req, res) => {
  try {
    const sec = await Secretary.create(req.body);
    res.json(sec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تعديل سكريتيرة
router.put('/:id', async (req, res) => {
  try {
    const sec = await Secretary.findByPk(req.params.id);
    if (!sec) return res.status(404).json({ error: 'Secretary not found' });

    await sec.update(req.body);
    res.json(sec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف سكريتيرة
router.delete('/:id', async (req, res) => {
  try {
    const sec = await Secretary.findByPk(req.params.id);
    if (!sec) return res.status(404).json({ error: 'Secretary not found' });

    await sec.destroy();
    res.json({ message: 'Secretary deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;