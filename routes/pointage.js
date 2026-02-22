const express = require("express");
const router = express.Router();
const { Pointage, Teacher } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { teacherId, userId, remarque } = req.body;

    const pointage = await Pointage.create({
      teacherId,
      userId,
      date: new Date(),
      heureArrivee: new Date(),
      remarque
    });

    res.json(pointage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;