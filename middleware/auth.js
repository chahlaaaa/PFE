const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).send("يجب تسجيل الدخول أولاً");

    try {
        const decoded = jwt.verify(token, "super_secret_key_123");
        req.user = decoded; // حفظ بيانات المستخدم في الطلب
        next(); // السماح بالمرور للمسار التالي
    } catch (err) {
        return res.status(401).send("توكن غير صالح");
    }
};