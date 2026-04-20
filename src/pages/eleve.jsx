// ============================================================
// Eleve.jsx — Interface complète de l'élève (CORRIGÉ)
// ============================================================

import { useState } from 'react';
import './Eleve.css';

// ── DONNÉES ÉLÈVE ────────────────────────────────────────────
const ELEVE = {
  nom:      'Semoud Maissoune',
  initials: 'SM',
  classe:   'B2',
  numero:   'INS-2024-0087',
  annee:    '2025 / 2026',
  statut:   'Scolarité Active',
  color:    '#4f8ef7',
};

// ── NOTES (Français + Anglais) ───────────────────────────────
// CORRECTION : coef ajouté, test1 corrigé (tes1 → test1)
const NOTES_DATA = [
  {
    matiere: 'Français', icon: '🇫🇷',
    color: '#4f8ef7', bg: '#EFF6FF',
    coef: 3,
    test1: 15.00, test2: 15.00, test3: 15.00,
    niveauActuel: 'B2', niveauCible: 'C1',
  },
  {
    matiere: 'Anglais', icon: 'AG',
    color: '#22c55e', bg: '#F0FDF4',
    coef: 2,
    test1: 15.0, test2: 16.5, test3: 16.0,
    niveauActuel: 'A1', niveauCible: 'A2',
  },
];

// CORRECTION : diviseur 3 (3 tests) au lieu de 4
function calcMoy(n) {
  return ((n.test1 + n.test2 + n.test3) / 3).toFixed(2);
}
function moyClass(m) {
  const v = parseFloat(m);
  if (v >= 14) return 'moyenne-green';
  if (v >= 10) return 'moyenne-orange';
  return 'moyenne-red';
}
function promoLabel(m) {
  const v = parseFloat(m);
  if (v >= 12) return { cls: 'promo-up',   label: '↑ C1' };
  if (v >= 10) return { cls: 'promo-same', label: '~ Limite' };
  return               { cls: 'promo-down', label: '↓ Redoub.' };
}
function barColor(note) {
  if (note >= 14) return '#767c91';
  if (note >= 10) return '#f97316';
  return '#ef4444';
}

// ── PROGRAMME COURS ──────────────────────────────────────────
const COURS_DATA = [
  { seq: 'Séq. 1', projet: 'Texte informatif', matiere: 'Français', type: 'Compréhension', statut: 'Terminé',   duree: '2h', color: '#4f8ef7', bg: '#EFF6FF' },
  { seq: 'Séq. 1', projet: 'Champ lexical',    matiere: 'Français', type: 'Vocabulaire',   statut: 'Terminé',   duree: '1h', color: '#4f8ef7', bg: '#EFF6FF' },
  { seq: 'Séq. 2', projet: 'Texte argumentatif', matiere: 'Français', type: 'Grammaire',   statut: 'En cours',  duree: '2h', color: '#4f8ef7', bg: '#EFF6FF' },
  { seq: 'Séq. 2', projet: 'Rédaction persuasive', matiere: 'Français', type: 'Expression écrite', statut: 'À faire', duree: '2h', color: '#4f8ef7', bg: '#EFF6FF' },
  { seq: 'Séq. 1', projet: 'Vocabulary & Grammar', matiere: 'Anglais', type: 'Compréhension', statut: 'Terminé', duree: '2h', color: '#22c55e', bg: '#F0FDF4' },
  { seq: 'Séq. 2', projet: 'Oral Presentation',    matiere: 'Anglais', type: 'Expression orale', statut: 'En cours', duree: '1h', color: '#22c55e', bg: '#F0FDF4' },
  { seq: 'Séq. 3', projet: 'Essay Writing',         matiere: 'Anglais', type: 'Expression écrite', statut: 'À faire',  duree: '2h', color: '#22c55e', bg: '#F0FDF4' },
];

const STATUT_BADGE = {
  'Terminé':   { cls: 'promo-up',   label: '✓ Terminé'  },
  'En cours':  { cls: 'promo-same', label: '⏳ En cours' },
  'À faire':   { cls: 'promo-down', label: '○ À faire'   },
  'Planifié':  { cls: 'promo-down', label: '◻ Planifié'  },
};

// ── ABSENCES ────────────────────────────────────────────────
const ABSENCES_DATA = [
  { matiere: 'Français', date: '03/04/2026', justif: false, motif: null,               color: '#4f8ef7' },
  { matiere: 'Anglais',  date: '10/04/2026', justif: true,  motif: 'Certificat médical', color: '#22c55e' },
];

// ── EMPLOI DU TEMPS ──────────────────────────────────────────
const JOURS = ['Mardi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08h–10h', '10h–12h', '14h–16h', '16h–18h'];
const EDT = {
  Mardi: {
    '08h–10h': null,
    '10h–12h': null,
    '14h–16h': { m: 'Anglais',  c: '#22c55e', bg: '#F0FDF4', salle: 'Salle 5',  prof: 'Mme. Meziane' },
    '16h–18h': { m: 'Français', c: '#4f8ef7', bg: '#EFF6FF', salle: 'Salle 12', prof: 'B. Hamidi'     },
  },
  Jeudi: {
    '08h–10h': { m: 'Anglais',  c: '#22c55e', bg: '#F0FDF4', salle: 'Labo 2',   prof: 'M. Kaci'    },
    '10h–12h': { m: 'Français', c: '#4f8ef7', bg: '#EFF6FF', salle: 'Salle 12', prof: 'B. Hamidi'  },
    '14h–16h': { m: 'Français', c: '#4f8ef7', bg: '#EFF6FF', salle: 'Salle 12', prof: 'B. Hamidi'  },
    '16h–18h': null,
  },
  Vendredi: {
    '08h–10h': { m: 'Français', c: '#4f8ef7', bg: '#EFF6FF', salle: 'Salle 12', prof: 'M. Benali' },
    '10h–12h': null,
    '14h–16h': null,
    '16h–18h': null,
  },
  Samedi: {
    '08h–10h': { m: 'Anglais',  c: '#22c55e', bg: '#F0FDF4', salle: 'Salle 5',  prof: 'Mme. Meziane' },
    '10h–12h': { m: 'Français', c: '#4f8ef7', bg: '#EFF6FF', salle: 'Salle 12', prof: 'B. Hamidi'     },
    '14h–16h': { m: 'Anglais',  c: '#22c55e', bg: '#F0FDF4', salle: 'Salle 5',  prof: 'Mme. Meziane' },
    '16h–18h': null,
  },
};

// ── DEVOIRS À RENDRE (dashboard) ────────────────────────────
// CORRECTION : dates au format JJ/MM/AAAA
const DEVOIRS = [
  { matiere: 'Français', sujet: " Compréhension écrite",         date: '20/04/2026', color: '#4f8ef7' },
  { matiere: 'Anglais',  sujet: 'Reading Comprehension ', date: '23/04/2026', color: '#22c55e' },
  { matiere: 'Français', sujet: 'Grammaire',       date: '28/04/2026', color: '#4f8ef7' },
];

// ── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function Eleve() {
  const [page, setPage] = useState('dashboard');
  const [filtreCours, setFiltreCours] = useState('Tous');

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'notes',     icon: '📝', label: 'Mes Notes'       },
    { id: 'cours',     icon: '📚', label: 'Mes Cours'       },
    { id: 'absences',  icon: '📋', label: 'Absences'        },
    { id: 'edt',       icon: '🗓️', label: 'Mon EDT'         },
  ];

  return (
    <div className="eleve-layout">

      {/* ══════════════════════════════════════════
          SIDEBAR ÉLÈVE
          ══════════════════════════════════════════ */}
      <aside className="sidebar">

        <div className="sidebar-logo-block">
          <div className="sidebar-logo-icon-wrap">
            <span className="sidebar-logo-emoji">🎓</span>
          </div>
          <div className="sidebar-logo-text">سبل النجاح</div>
          <div className="sidebar-logo-sub">Ways of Success</div>
        </div>

        <span className="sidebar-section-label">MON ESPACE</span>

        <nav style={{ flex: 1 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* CORRECTION : flèche → supprimée (n'était pas un lien de déconnexion) */}
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: 'linear-gradient(135deg,#4f8ef7,#6366f1)' }}>
            {ELEVE.initials}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{ELEVE.nom}</div>
            <div className="role">{ELEVE.classe} · Élève</div>
          </div>
            <span className="sidebar-arrow" onClick={() => window.history.back()}>←</span>

        </div>
      </aside>

      {/* ══════════════════════════════════════════
          CONTENU PRINCIPAL
          ══════════════════════════════════════════ */}
      <main className="main-content">
        {page === 'dashboard' && <PageDashboard devoirs={DEVOIRS} />}
        {page === 'notes'     && <PageNotes />}
        {page === 'cours'     && <PageCours filtre={filtreCours} setFiltre={setFiltreCours} />}
        {page === 'absences'  && <PageAbsences />}
        {page === 'edt'       && <PageEdt />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 1 — TABLEAU DE BORD
// ══════════════════════════════════════════════════════════════
function PageDashboard({ devoirs }) {
  // CORRECTION : calcul correct de la moyenne générale pondérée
  const totalCoef = NOTES_DATA.reduce((acc, n) => acc + n.coef, 0);
  const moyGen = (
    NOTES_DATA.reduce((acc, n) => acc + parseFloat(calcMoy(n)) * n.coef, 0) / totalCoef
  ).toFixed(2);

  const totalAbs  = ABSENCES_DATA.length;
  const nonJustif = ABSENCES_DATA.filter(a => !a.justif).length;

  return (
    <>
      <h1 className="page-title">Tableau de bord</h1>

      {/* Carte profil élève */}
      <div className="eleve-profile-card">
        <div className="eleve-profile-avatar">
          <span>{ELEVE.initials}</span>
        </div>
        <div className="eleve-profile-info">
          <h2 className="eleve-profile-name">{ELEVE.nom}</h2>
          <p className="eleve-profile-sub">
            Année {ELEVE.annee} &nbsp;·&nbsp; N° {ELEVE.numero}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <span className="promo-badge promo-up">✅ {ELEVE.statut}</span>
            <span className="promo-badge promo-same">📚 {ELEVE.classe}</span>
          </div>
        </div>
        <div className="eleve-profile-level">
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 3 }}>Moy. Générale</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fff' }}>{moyGen}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>/ 20</div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <span className="stat-icon">📊</span>
          <div className="stat-number">{moyGen}</div>
          <div className="stat-label">Moyenne générale</div>
          <div className="stat-sub">Toutes matières · Coeff. pondéré</div>
        </div>
        <div className="stat-card orange">
          <span className="stat-icon">📋</span>
          <div className="stat-number">{totalAbs}</div>
          <div className="stat-label">Absences ce trimestre</div>
          <div className="stat-sub">{nonJustif} non justifiées</div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">📝</span>
          <div className="stat-number">{devoirs.length}</div>
          <div className="stat-label">Test à rendre</div>
          <div className="stat-sub">Cette semaine</div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="bottom-grid">

        {/* CORRECTION : Maths supprimé — seulement Français & Anglais */}
        <div className="section-card">
          <h3>📅 Cours aujourd'hui — Mardi</h3>
          {[
            { heure: '14h00 – 16h00', m: 'Anglais',  detail: 'B2 · Salle 5',  color: '#22c55e' },
            { heure: '16h00 – 18h00', m: 'Français', detail: 'B2 · Salle 12', color: '#4f8ef7' },
          ].map((c, i) => (
            <div key={i} className="course-item">
              <div className="course-time" style={{ borderLeftColor: c.color, color: c.color, background: c.color + '14' }}>
                {c.heure}
              </div>
              <div className="course-info">
                <div className="subject">{c.m}</div>
                <div className="details">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Devoirs à rendre — CORRECTION : date au format JJ/MM/AAAA */}
        <div className="section-card">
          <h3>📚 Devoirs à rendre</h3>
          <table className="notes-table-mini">
            <thead>
              <tr>
                <th>MATIÈRE</th>
                <th>Test</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {devoirs.map((d, i) => (
                <tr key={i}>
                  <td>
                    <span className="matiere-badge" style={{ background: d.color + '18', color: d.color }}>
                      {d.matiere}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#334155' }}>{d.sujet}</td>
                  {/* CORRECTION : style date JJ/MM/AAAA */}
                  <td style={{ fontWeight: 700, color: '#ef4444', fontSize: 12 }}>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 2 — NOTES
// ══════════════════════════════════════════════════════════════
function PageNotes() {
  // CORRECTION : calcul moyenne générale correct
  const totalCoef = NOTES_DATA.reduce((acc, n) => acc + n.coef, 0);
  const moyGen = (
    NOTES_DATA.reduce((acc, n) => acc + parseFloat(calcMoy(n)) * n.coef, 0) / totalCoef
  ).toFixed(2);

  return (
    <>
      {/* CORRECTION : suppression de "3ème Secondaire → 4ème Secondaire" */}
      <div className="flex-between" style={{ marginBottom: 22 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Mes Notes</h1>
      </div>

      {/* Tableau de toutes les notes */}
      <div className="notes-card">
        <div className="notes-card-header">
          <h3>Résultats scolaires — 2025 / 2026</h3>
          <span className="count-badge">{NOTES_DATA.length} matières</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="notes-table">
            <thead>
              <tr>
                <th>MATIÈRE</th>
                <th>Test 1</th>
                <th>Test 2</th>
                <th>Test 3</th>
                <th>MOYENNE</th>
                <th>NIVEAU CIBLE</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {NOTES_DATA.map((n, i) => {
                const moy   = calcMoy(n);
                const promo = promoLabel(moy);
                return (
                  <tr key={i}>
                    <td>
                      <div className="eleve-cell">
                        <div className="matiere-icon" style={{ background: n.bg, color: n.color, fontSize: 16 }}>
                          {n.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{n.matiere}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>Coeff. {n.coef}</div>
                        </div>
                      </div>
                    </td>
{[n.test1, n.test2, n.test3].map((v, j) => (
  <td key={j}>
    <span style={{ 
      fontWeight: 800, 
      color: barColor(v),
      fontFamily: "'Plus Jakarta Sans', sans-serif", 
      fontSize: 15                                    
    }}>{v}</span>
  </td>
))}

                    <td>
                      <span className={`stat-number-sm ${moyClass(moy)}`}>{moy}</span>
                    </td>
                    <td style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 600 }}>
                      {n.niveauCible}
                    </td>
                    <td>
                      <span className={`promo-badge ${promo.cls}`}>{promo.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CORRECTION : suppression du bandeau "3ème → 4ème Secondaire", remplacé par info neutre */}
      <div className="eleve-info-banner">
        🎯 &nbsp; Une moyenne générale ≥ 10/20 est requise pour valider l'année.
        Ta moyenne actuelle est de <strong>{moyGen}/20</strong>.
      </div>
    </>
  );
}
<div className="sidebar-user">
  <div className="sidebar-avatar" style={{ background: 'linear-gradient(135deg,#4f8ef7,#6366f1)' }}>
    {ELEVE.initials}
  </div>
  <div className="sidebar-user-info">
    <div className="name">{ELEVE.nom}</div>
    <div className="role">{ELEVE.classe} · Élève</div>
  </div>
  {/* ← زيد هذا */}
  <span
    onClick={() => window.history.back()}
    style={{ cursor: 'pointer', color: '#4f8ef7', fontSize: 20, marginLeft: 'auto' }}
  >←</span>
</div>

// ══════════════════════════════════════════════════════════════
// PAGE 3 — COURS
// ══════════════════════════════════════════════════════════════
function PageCours({ filtre, setFiltre }) {
  const matieres = ['Tous', ...new Set(COURS_DATA.map(c => c.matiere))];
  const filtered = filtre === 'Tous' ? COURS_DATA : COURS_DATA.filter(c => c.matiere === filtre);

  return (
    <>
      <div className="cours-header">
        <h1 className="page-title" style={{ margin: 0 }}>Mes Cours — Français & Anglais</h1>
      </div>

      <div className="cours-filters">
        {matieres.map(m => (
          <button
            key={m}
            className={`filter-pill ${filtre === m ? 'active' : ''}`}
            onClick={() => setFiltre(m)}
          >
            {m}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
          {filtered.length} séance{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="notes-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="cours-table">
            <thead>
              <tr>
                <th>SÉQUENCE</th>
                <th>MATIÈRE</th>
                <th>PROJET / CONTENU</th>
                <th>TYPE</th>
                <th>DURÉE</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const s = STATUT_BADGE[c.statut] || { cls: 'promo-same', label: c.statut };
                return (
                  <tr key={i}>
                    <td>
                      <span className="matiere-badge" style={{ background: c.color + '18', color: c.color }}>
                        {c.seq}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="matiere-icon" style={{ background: c.bg, color: c.color }}>
                          {c.matiere === 'Français' ? '🇫🇷' : '🇬🇧'}
                        </div>
                        <span style={{ fontWeight: 600 }}>{c.matiere}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{c.projet}</td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{c.type}</td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{c.duree}</td>
                    <td><span className={`promo-badge ${s.cls}`}>{s.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 4 — ABSENCES
// ══════════════════════════════════════════════════════════════
function PageAbsences() {
  const total     = ABSENCES_DATA.length;
  const justif    = ABSENCES_DATA.filter(a => a.justif).length;
  const nonJustif = total - justif;

  const parMat = ABSENCES_DATA.reduce((acc, a) => {
    acc[a.matiere] = acc[a.matiere] || { count: 0, color: a.color };
    acc[a.matiere].count++;
    return acc;
  }, {});

  return (
    <>
      <h1 className="page-title">Absences</h1>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat-card blue">
          <span className="stat-icon">📋</span>
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total absences</div>
          <div className="stat-sub">Ce trimestre</div>
        </div>
        <div className="stat-card orange">
          <span className="stat-icon">✅</span>
          <div className="stat-number" style={{ color: '#22c55e' }}>{justif}</div>
          <div className="stat-label">Justifiées</div>
          <div className="stat-sub">Avec certificat</div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">⚠️</span>
          <div className="stat-number">{nonJustif}</div>
          <div className="stat-label">Non justifiées</div>
          <div className="stat-sub">À régulariser</div>
        </div>
      </div>

      <div className="absences-grid">
        <div className="absence-panel">
          <div className="absence-panel-title">Répartition par matière</div>
          <div className="absence-panel-sub">Nombre d'absences par cours</div>

          {Object.entries(parMat).map(([mat, info]) => (
            <div key={mat} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: info.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{mat}</span>
              <span className="matiere-badge" style={{ background: info.color + '18', color: info.color }}>
                {info.count} abs.
              </span>
            </div>
          ))}

          <div className="absence-summary">
            <div className="summary-stat">
              <div className="summary-num" style={{ color: '#1e293b' }}>{total}</div>
              <div className="summary-lbl">TOTAL</div>
            </div>
            <div className="summary-stat">
              <div className="summary-num" style={{ color: '#22c55e' }}>{justif}</div>
              <div className="summary-lbl">JUSTIF.</div>
            </div>
            <div className="summary-stat">
              <div className="summary-num" style={{ color: '#ef4444' }}>{nonJustif}</div>
              <div className="summary-lbl">NON JUST.</div>
            </div>
          </div>
        </div>

        <div className="notes-card" style={{ flex: 2 }}>
          <div className="notes-card-header">
            <h3>Historique des absences</h3>
            <span className="count-badge">{total} entrées</span>
          </div>
          <table className="cours-table">
            <thead>
              <tr>
                <th>MATIÈRE</th>
                <th>DATE</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {ABSENCES_DATA.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 4, height: 36, borderRadius: 4, background: a.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{a.matiere}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>{a.date}</td>
                  <td>
                    <span className={`promo-badge ${a.justif ? 'promo-up' : 'promo-down'}`}>
                      {a.justif ? '✅ Justifiée' : '⚠️ Non justif.'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#94a3b8', fontStyle: a.motif ? 'normal' : 'italic' }}>
                    {a.motif || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE 5 — EMPLOI DU TEMPS
// ══════════════════════════════════════════════════════════════
function PageEdt() {
  const countFr = JOURS.reduce((acc, j) =>
    acc + HEURES.filter(h => EDT[j][h]?.m === 'Français').length, 0);
  const countEn = JOURS.reduce((acc, j) =>
    acc + HEURES.filter(h => EDT[j][h]?.m === 'Anglais').length, 0);

  return (
    <>
      <div className="edt-header">
        <h1 className="page-title" style={{ margin: 0 }}>Mon Emploi du Temps</h1>
        <div className="edt-controls">
          <div className="eleve-edt-summary">
            <span style={{ background: '#EFF6FF', color: '#4f8ef7' }}> Français · {countFr} séances</span>
            <span style={{ background: '#F0FDF4', color: '#22c55e' }}> Anglais · {countEn} séances</span>
          </div>
        </div>
      </div>

      <div className="notes-card" style={{ overflowX: 'auto' }}>
        <table className="edt-table">
          <thead>
            <tr>
              <th>Horaire</th>
              {JOURS.map(j => <th key={j}>{j}</th>)}
            </tr>
          </thead>
          <tbody>
            {HEURES.map(h => (
              <tr key={h}>
                <td>{h}</td>
                {JOURS.map(j => {
                  const cours = EDT[j][h];
                  if (!cours) {
                    return (
                      <td key={j}>
                        <div className="edt-cell empty">
                          <span className="edt-cell-plus">—</span>
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={j}>
                      <div className="edt-cell" style={{ background: cours.bg, borderLeft: `3px solid ${cours.c}` }}>
                        <div className="edt-cell-matiere" style={{ color: cours.c }}>{cours.m}</div>
                        <div className="edt-cell-prof">{cours.prof}</div>
                        <div className="edt-cell-salle">{cours.salle}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="eleve-edt-legend">
        {[
          { label: 'Français', color: '#4f8ef7', bg: '#EFF6FF' },
          { label: 'Anglais',  color: '#22c55e', bg: '#F0FDF4' },
        ].map(l => (
          <div key={l.label} className="eleve-legend-pill" style={{ background: l.bg, color: l.color }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </>
  );
}
