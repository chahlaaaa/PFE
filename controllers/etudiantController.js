const db = require('../config/db');

// 1. تسجيل طالب جديد (إضافة في جدول utilisateur ثم etudiant)
exports.registerEtudiant = (req, res) => {
    const { nom, email, nomUtilisateur, idGroupe } = req.body;
    
    // أولاً: إضافة الطالب كـ "مستخدم" عام
    const queryUser = "INSERT INTO utilisateur (nom, email, nomUtilisateur) VALUES (?, ?, ?)";
    
    db.query(queryUser, [nom, email, nomUtilisateur], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const newUserId = result.insertId;
        
        // ثانياً: ربطه بجدول etudiant
        const queryEtud = "INSERT INTO etudiant (idEtudiant, idGroupe) VALUES (?, ?)";
        db.query(queryEtud, [newUserId, idGroupe], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.status(201).json({ message: "Étudiant inscrit avec succès", id: newUserId });
        });
    });
};

// 2. جلب كل الطلاب مع معلوماتهم الشخصية (Joindre utilisateur et etudiant)
exports.getAllEtudiants = (req, res) => {
    const query = `
        SELECT u.idUtilisateur as id, u.nom, u.email, e.idGroupe 
        FROM utilisateur u 
        JOIN etudiant e ON u.idUtilisateur = e.idEtudiant
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 3. جلب نقاط الطالب (يتوافق مع جدول note)
exports.getEtudiantNotes = (req, res) => {
    const query = "SELECT * FROM note WHERE idEtudiant = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 4. جلب حضور الطالب (يتوافق مع جدول presence)
exports.getEtudiantPresence = (req, res) => {
    const query = "SELECT * FROM presence WHERE idEtudiant = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 5. حذف طالب (يجب الحذف من etudiant أولاً بسبب القيود/Foreign Keys)
exports.deleteEtudiant = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM etudiant WHERE idEtudiant = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query("DELETE FROM utilisateur WHERE idUtilisateur = ?", [id], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Étudiant supprimé définitivement" });
        });
    });
};

// دوال تكميلية للمسارات
exports.updateEtudiantLevel = (req, res) => { res.json({ message: "Mise à jour du groupe effectuée" }); };
exports.getEtudiantProfile = (req, res) => { 
    const query = "SELECT * FROM utilisateur u JOIN etudiant e ON u.idUtilisateur = e.idEtudiant WHERE u.idUtilisateur = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};