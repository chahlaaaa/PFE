
const Admin = require('../models/admin');

// جلب بيانات الآدمن الوحيد (عادة يكون المعرف 1)
exports.getAdminProfile = async (req, res) => {
  try {
    // نجلب أول سجل في الجدول لأنه آدمن وحيد
    const admin = await Admin.findOne(); 
    if (!admin) return res.status(404).json({ error: 'Profil introuvable' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث بيانات الآدمن (الاسم، البريد، كلمة السر)
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ error: 'Profil introuvable' });

    await admin.update(req.body);
    res.status(200).json({ message: 'Profil mis à jour avec succès', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};