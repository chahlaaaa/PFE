const db = require('../config/db');

// --- GESTION DES COMPTES ---

exports.getAllAccounts = (req, res) => {
    const query = `
        SELECT u.idUtilisateur, u.nom, u.email, u.nomUtilisateur, c.role, c.activite 
        FROM utilisateur u 
        JOIN compte c ON u.nomUtilisateur = c.nomUtilisateur 
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createAccount = (req, res) => {
    const { nomUtilisateur, motDePasse, role, nom, email, age } = req.body;

    // Insertion dans la table 'compte' 
    const queryCompte = "INSERT INTO compte (nomUtilisateur, motDePasse, role, activite) VALUES (?, ?, ?, 1)";
    db.query(queryCompte, [nomUtilisateur, motDePasse, role], (err) => {
        if (err) return res.status(500).json({ error: "Erreur lors de la création du compte" });

        // Insertion dans la table 'utilisateur' 
        const queryUser = "INSERT INTO utilisateur (nom, age, email, nomUtilisateur) VALUES (?, ?, ?, ?)";
        db.query(queryUser, [nom, age, email, nomUtilisateur], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.status(201).json({ message: "Compte créé avec succès" });
        });
    });
};

exports.toggleAccountStatus = (req, res) => {
    const { nomUtilisateur } = req.params;
    const { activite } = req.body; // 0 pour inactif, 1 pour actif 
    db.query("UPDATE compte SET activite = ? WHERE nomUtilisateur = ?", [activite, nomUtilisateur], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Statut mis à jour" });
    });
};

// --- GESTION DES PROGRAMMES ---

exports.getAllProgrammes = (req, res) => {
    const query = "SELECT * FROM programme"; [cite: 1]
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createProgramme = (req, res) => {
    const { heureDebut, heureFin, idGroupe, idFormation, idSuperviseur, idNiveau } = req.body;
    const query = "INSERT INTO programme (heureDebut, heureFin, idGroupe, idFormation, idSuperviseur, idNiveau) VALUES (?, ?, ?, ?, ?, ?)"; [cite: 1]
    db.query(query, [heureDebut, heureFin, idGroupe, idFormation, idSuperviseur, idNiveau], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Programme créé", id: result.insertId });
    });
};

exports.updateProgramme = (req, res) => {
    const { id } = req.params;
    const { heureDebut, heureFin } = req.body;
    db.query("UPDATE programme SET heureDebut = ?, heureFin = ? WHERE idProgramme = ?", [heureDebut, heureFin, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Programme mis à jour" });
    });
};

exports.deleteProgramme = (req, res) => {
    db.query("DELETE FROM programme WHERE idProgramme = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Programme supprimé" });
    });
};

// --- GESTION DES ABSENCES DES EMPLOYÉS ---

// 1. جلب قائمة الموظفين فقط (الأساتذة، السكرتارية، المشرفين)
// هذا الاستعلام يضمن عدم ظهور الطلاب في القائمة المخصصة لغياب الموظفين
exports.getEmployeesForAbsence = (req, res) => {
    const query = `
        SELECT u.idUtilisateur, u.nom, c.role 
        FROM utilisateur u 
        JOIN compte c ON u.nomUtilisateur = c.nomUtilisateur 
        WHERE c.role IN ('enseignant', 'superviseur', 'secretaire') 
        AND c.activite = 1
    `; [cite: 1]

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 2. تسجيل غياب موظف (في الجدول الجديد الذي اقترحناه)
exports.markEmployeeAbsence = (req, res) => {
    const { idEmploye, date, type, justification } = req.body;
    const query = "INSERT INTO presence_employe (idEmploye, date, type, justification) VALUES (?, ?, ?, ?)"; [cite: 1]
    
    db.query(query, [idEmploye, date, type, justification], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Absence de l'employé enregistrée" });
    });
};

// --- GESTION DES ABSENCES DES ÉTUDIANTS ---

exports.markAbsence = (req, res) => {
    const { idEtudiant, date, absenceJustifiee } = req.body;
    const query = "INSERT INTO presence (idEtudiant, date, absenceJustifiee) VALUES (?, ?, ?)"; [cite: 1]
    db.query(query, [idEtudiant, date, absenceJustifiee], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Absence étudiante enregistrée" });
    });
};

exports.getStudentAbsences = (req, res) => {
    db.query("SELECT * FROM presence WHERE idEtudiant = ?", [req.params.idEtudiant], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};