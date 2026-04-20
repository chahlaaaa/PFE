// ============================================================
//  shared.js — données & utilitaires communs aux deux espaces
// ============================================================

const ELEVES_INIT = [
  { id: 1, nom: "Semoud Maissoune", initiales: "SM", couleur: "#7c6f9f", test1: 14, test2: 16, test3: 15, niveau: "A1", classe: "Groupe A1" },
  { id: 2, nom: "Bouteldja Salwa",  initiales: "BS", couleur: "#8b6f6f", test1: 8,  test2: 9,  test3: 11, niveau: "A2", classe: "Groupe A2" },
  { id: 3, nom: "Asma Salmi",       initiales: "AS", couleur: "#6f8b6f", test1: 17, test2: 18, test3: 16, niveau: "B1", classe: "Groupe B1" },
  { id: 4, nom: "Karim Messaoud",   initiales: "KM", couleur: "#8b7f5f", test1: 7,  test2: 6,  test3: null, niveau: "B2", classe: "Groupe B2" },
  { id: 5, nom: "Rania Bouazza",    initiales: "RB", couleur: "#5f7f8b", test1: 12, test2: 14, test3: 13, niveau: "C1", classe: "Groupe C1" },
  { id: 6, nom: "Lina Hamidi",      initiales: "LH", couleur: "#8b5f7f", test1: 19, test2: 20, test3: 18, niveau: "C2", classe: "Groupe C2" },
];

const COURS_INIT = [
  { id: 1, titre: "Grammaire de base",        matiere: "Français", classe: "Groupe A1", date: "15/03/2026" },
  { id: 2, titre: "Speaking Practice",         matiere: "Anglais",  classe: "Groupe A2", date: "16/03/2026" },
  { id: 3, titre: "Alphabet et Prononciation", matiere: "Deutsch",  classe: "Groupe B1", date: "17/03/2026" },
  { id: 4, titre: "Vocabulaire",               matiere: "Français", classe: "Groupe A2", date: "18/03/2026" },
];

const EDT_INIT = {
  "Groupe A1": {
    "Mardi":    { "14:00–15:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" } },
    "Jeudi":    { "10:00–11:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 08" } },
    "Vendredi": {
      "08:00–09:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" },
      "14:00–15:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" },
      "16:00–17:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 07" },
    },
    "Samedi": {
      "08:00–09:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 08" },
      "10:00–11:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" },
      "14:00–15:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" },
    },
  },
  "Groupe A2": {
    "Mardi":    { "10:00–11:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" } },
    "Jeudi":    { "14:00–15:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" } },
    "Vendredi": { "10:00–11:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 07" } },
  },
  "Groupe B1": {
    "Mardi":    { "08:00–09:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 08" } },
    "Jeudi":    { "16:00–17:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" } },
  },
  "Groupe B2": {
    "Vendredi": { "14:00–15:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" } },
    "Samedi":   { "10:00–11:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" } },
  },
  "Groupe C1": {
    "Mardi":    { "16:00–17:30": { matiere: "Anglais",  prof: "M. Hadid",    salle: "Salle 03" } },
    "Samedi":   { "08:00–09:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" } },
  },
  "Groupe C2": {
    "Jeudi":    { "08:00–09:30": { matiere: "Français", prof: "B. Hamidi",   salle: "Salle 02" } },
    "Vendredi": { "16:00–17:30": { matiere: "Deutsch",  prof: "M. Mansouri", salle: "Salle 07" } },
  },
};

const ELEVES_PAR_CLASSE = {
  "Groupe A1": [
    { id: 1, nom: "Maya Hadji",    initiales: "MH", color: "#EC4899" },
    { id: 2, nom: "Omar Hadj",     initiales: "OH", color: "#6366F1" },
    { id: 3, nom: "Salma Ali",     initiales: "SA", color: "#10B981" },
    { id: 4, nom: "Adem Bouzid",   initiales: "AB", color: "#F59E0B" },
    { id: 5, nom: "Lina Mansouri", initiales: "LM", color: "#3B82F6" },
  ],
  "Groupe A2": [
    { id: 6, nom: "Rania Hamidi",  initiales: "RH", color: "#8B5CF6" },
    { id: 7, nom: "Karim Zouari",  initiales: "KZ", color: "#EF4444" },
    { id: 8, nom: "Sara Bensalem", initiales: "SB", color: "#14B8A6" },
  ],
  "Groupe B1": [
    { id: 9,  nom: "Amine Touati", initiales: "AT", color: "#F97316" },
    { id: 10, nom: "Nadia Kerrar", initiales: "NK", color: "#6366F1" },
  ],
  "Groupe B2": [
    { id: 11, nom: "Youcef Rahali", initiales: "YR", color: "#10B981" },
    { id: 12, nom: "Amira Bouzid",  initiales: "AB", color: "#EC4899" },
    { id: 13, nom: "Sofiane Ait",   initiales: "SA", color: "#F59E0B" },
  ],
  "Groupe C1": [
    { id: 14, nom: "Imane Khaled", initiales: "IK", color: "#8B5CF6" },
    { id: 15, nom: "Nassim Bouri", initiales: "NB", color: "#EF4444" },
  ],
  "Groupe C2": [
    { id: 16, nom: "Lyes Meziane", initiales: "LM", color: "#3B82F6" },
    { id: 17, nom: "Houda Ferhat", initiales: "HF", color: "#14B8A6" },
  ],
};

const ABSENCES_INIT = [
  { id: 1, eleve: "Omar Hadj",     date: "10/03/2026", seance: "Français", justifiee: "Non" },
  { id: 2, eleve: "Salma Mahdi",   date: "09/03/2026", seance: "Français", justifiee: "En attente" },
  { id: 3, eleve: "Ahmed Brahimi", date: "11/03/2026", seance: "Anglais",  justifiee: "Oui" },
];

const CLASSES = ["Groupe A1", "Groupe A2", "Groupe B1", "Groupe B2", "Groupe C1", "Groupe C2"];
const SEANCES = ["08:00 – 09:30", "10:00 – 11:30", "12:00 – 13:30", "14:00 – 15:30", "16:00 – 17:30"];

const MATIERE_COLORS = {
  "Français": { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "Anglais":  { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "Deutsch":  { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
};

const JUSTIF_STYLE = {
  "Oui":        { bg: "#D1FAE5", color: "#065F46" },
  "Non":        { bg: "#FEE2E2", color: "#991B1B" },
  "En attente": { bg: "#FEF3C7", color: "#92400E" },
};

function getMatiereStyle(m) {
  return MATIERE_COLORS[m] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };
}

function getMatieresPourClasse(classe) {
  const edtClasse = EDT_INIT[classe];
  if (!edtClasse) return ["Français", "Anglais", "Deutsch"];
  const matieres = Object.values(edtClasse)
    .flatMap(creneaux => Object.values(creneaux).map(c => c.matiere));
  const unique = [...new Set(matieres)];
  return unique.length > 0 ? unique : ["Français", "Anglais", "Deutsch"];
}

function calcMoyenne(t1, t2, t3) {
  const valides = [t1, t2, t3].filter(v => v !== null && v !== undefined && v !== "");
  if (valides.length === 0) return null;
  return valides.reduce((a, b) => Number(a) + Number(b), 0) / valides.length;
}

function moyenneClass(moy) {
  if (moy === null) return "";
  if (moy >= 14) return "moyenne-green";
  if (moy >= 10) return "moyenne-orange";
  return "moyenne-red";
}

function calcPromotion(niveau, moyenne) {
  const niveaux = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const idx = niveaux.indexOf(niveau);
  if (moyenne === null) return { text: `= ${niveau}`, cls: "promo-same" };
  if (moyenne >= 14 && idx < niveaux.length - 1) return { text: `↑ ${niveaux[idx + 1]}`, cls: "promo-up" };
  if (moyenne < 10 && idx > 0)                   return { text: `↓ ${niveaux[idx - 1]}`, cls: "promo-down" };
  return { text: `= ${niveau}`, cls: "promo-same" };
}

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

// LOGO base64 partagé
const LOGO_B64 = "c:\Users\DELL\Pictures.png"



