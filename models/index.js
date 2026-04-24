// models/index.js
const Compte = require('./Compte');
const Etudiant = require('./Etudiant');
const Note = require('./Note');
const Presence = require('./Presence');
// models/index.js (أضيفي هذه التحديثات)
const formation = require('./formation');
const Enseignant = require('./Enseignant');
const Groupe = require('./Groupe');
const Etudiant = require('./Etudiant');

// 1. علاقة الأستاذ واللغة
formation.hasMany(Enseignant, { foreignKey: 'idFormation' });
Enseignant.belongsTo(formation, { foreignKey: 'idFormation' });

// 2. علاقة المشرف والأفواج (المشرف هو نوع من أنواع الحسابات Compte)
// Compte.hasMany(Groupe, { foreignKey: 'superviseurId' });

// 3. علاقة الفوج والأستاذ
Enseignant.hasMany(Groupe, { foreignKey: 'enseignantId' });
Groupe.belongsTo(Enseignant, { foreignKey: 'enseignantId' });

// 4. علاقة الفوج والطلبة (الفوج به عدة طلبة)
Groupe.hasMany(Etudiant, { foreignKey: 'idGroupe' });
Etudiant.belongsTo(Groupe, { foreignKey: 'idGroupe' });

// الطالب لديه حساب واحد
Etudiant.belongsTo(Compte);

// الطالب لديه عدة نقاط
Etudiant.hasMany(Note, { foreignKey: 'idEtudiant' });
Note.belongsTo(Etudiant, { foreignKey: 'idEtudiant' });

// الطالب لديه سجل غيابات
Etudiant.hasMany(Presence, { foreignKey: 'idEtudiant' });
Presence.belongsTo(Etudiant, { foreignKey: 'idEtudiant' });

module.exports = { Compte, Etudiant, Note, Presence };