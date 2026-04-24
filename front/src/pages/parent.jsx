

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// ── INJECTION CSS GLOBALE (reprend Eleve.css + style.css) ────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:          #1a2236;
    --navy-light:    #243048;
    --navy-border:   #2e3d58;
    --accent-blue:   #4f8ef7;
    --accent-indigo: #6366f1;
    --accent-orange: #f97316;
    --accent-red:    #ef4444;
    --accent-green:  #22c55e;
    --text-primary:  #f1f5f9;
    --text-secondary:#94a3b8;
    --text-muted:    #64748b;
    --bg-main:       #f0f4fb;
    --card-border:   #e8edf5;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg-main); }

  .p-layout {
    display: flex; height: 100vh; overflow: hidden;
    font-family: 'DM Sans', sans-serif; background: var(--bg-main);
  }

  /* ── SIDEBAR ── */
  .p-sidebar {
    width: 300px; min-width: 300px; background: var(--navy);
    display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;
  }
  .p-logo-block {
    display: flex; flex-direction: column; align-items: center;
    padding: 22px 16px 18px; border-bottom: 1px solid rgba(255,255,255,.08); gap: 4px;
  }
  .p-logo-icon {
    width: 58px; height: 58px; background: rgba(255,255,255,.12);
    border-radius: 16px; border: 1px solid rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 6px; box-shadow: 0 4px 16px rgba(0,0,0,.2);
  }
  .p-logo-text {
    font-size: 17px; font-weight: 700; color: #fff; direction: rtl; letter-spacing: 0;
  }
  .p-logo-sub {
    font-size: 10px; font-weight: 600; color: rgba(255,255,255,.38);
    letter-spacing: 1px; text-transform: uppercase;
  }
  .p-section-label {
    display: block; padding: 14px 18px 6px;
    font-size: 10px; font-weight: 700;
    color: rgba(255,255,255,.35); letter-spacing: 1.2px; text-transform: uppercase;
  }
  .p-child-block { padding: 10px 14px 6px; }
  .p-child-select {
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
    border-radius: 12px; padding: 10px 14px; cursor: pointer;
    display: flex; align-items: center; gap: 10px; transition: background .15s;
  }
  .p-child-select:hover { background: rgba(255,255,255,.12); }
  .p-child-dropdown {
    margin-top: 6px; background: #243048;
    border: 1px solid rgba(255,255,255,.12); border-radius: 10px; overflow: hidden;
  }
  .p-child-opt {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; cursor: pointer; transition: background .15s;
  }
  .p-child-opt:hover { background: rgba(255,255,255,.06); }
  .p-nav-item {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 18px;
    background: none; border: none; cursor: pointer; color: rgba(255,255,255,.6);
    font-size: 13.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    transition: all .18s; text-align: left;
  }
  .p-nav-item:hover { background: rgba(255,255,255,.06); color: #fff; }
  .p-nav-item.active {
    background: rgba(79,142,247,.18); color: var(--accent-blue);
    border-right: 3px solid var(--accent-blue); font-weight: 700;
  }
  .p-nav-icon { font-size: 16px; width: 22px; text-align: center; }
  .p-sidebar-user {
    display: flex; align-items: center; gap: 10px; padding: 14px 16px;
    border-top: 1px solid rgba(255,255,255,.08); margin-top: auto;
  }
  .p-sidebar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .p-sidebar-name { font-size: 13px; font-weight: 700; color: #fff; }
  .p-sidebar-role { font-size: 11px; color: rgba(255,255,255,.4); }

  /* ── MAIN ── */
  .p-main { flex: 1; overflow-y: auto; padding: 28px 32px; background: var(--bg-main); }
  .p-page-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 22px; font-weight: 800; color: #0f172a;
    letter-spacing: -.4px; margin-bottom: 20px;
  }

  /* ── PROFILE BANNER ── */
  .p-profile-card {
    background: linear-gradient(135deg, #1a2236 0%, #2d3f56 100%);
    border-radius: 20px; padding: 24px 28px;
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 22px; box-shadow: 0 8px 28px rgba(0,0,0,.14);
    position: relative; overflow: hidden;
  }
  .p-profile-card::after {
    content: ''; position: absolute; right: -50px; top: -50px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(79,142,247,.1); pointer-events: none;
  }
  .p-profile-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 21px; font-weight: 800; color: #fff; flex-shrink: 0;
    border: 3px solid rgba(255,255,255,.18); box-shadow: 0 4px 16px rgba(79,142,247,.35);
  }
  .p-profile-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 19px; font-weight: 800; color: #fff; margin-bottom: 3px;
  }
  .p-profile-sub { font-size: 12px; color: rgba(255,255,255,.5); }
  .p-profile-level { text-align: right; padding-left: 20px; min-width: 100px; }
  .p-level-pill {
    display: flex; align-items: center; background: #fff;
    border: 1.5px solid var(--card-border); border-radius: 20px;
    padding: 6px 14px; font-size: 13px; font-weight: 600; color: #334155;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }

  /* ── STATS GRID ── */
  .p-stats-grid { display: grid; gap: 16px; margin-bottom: 20px; }
  .p-stat-card {
    background: #fff; border-radius: 16px; padding: 20px;
    border: 1px solid var(--card-border); box-shadow: 0 2px 8px rgba(0,0,0,.04);
    position: relative; overflow: hidden;
  }
  .p-stat-card::after {
    content: ''; position: absolute; right: -20px; top: -20px;
    width: 80px; height: 80px; border-radius: 50%; opacity: .08; pointer-events: none;
  }
  .p-stat-card.blue::after  { background: var(--accent-blue);   }
  .p-stat-card.green::after { background: var(--accent-green);  }
  .p-stat-card.orange::after{ background: var(--accent-orange); }
  .p-stat-card.red::after   { background: var(--accent-red);    }
  .p-stat-icon { font-size: 22px; display: block; margin-bottom: 8px; }
  .p-stat-number {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 26px; font-weight: 900; color: #0f172a; line-height: 1; margin-bottom: 4px;
  }
  .p-stat-label { font-size: 13px; font-weight: 600; color: #334155; }
  .p-stat-sub   { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  /* ── CARD ── */
  .p-card {
    background: #fff; border-radius: 16px; border: 1px solid var(--card-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04); overflow: hidden; margin-bottom: 16px;
  }
  .p-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--card-border);
  }
  .p-card-header h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 700; color: #1e293b; margin: 0;
  }
  .p-count-badge {
    background: #f1f5f9; color: #64748b; border-radius: 20px;
    padding: 3px 12px; font-size: 12px; font-weight: 600;
  }

  /* ── TABLE ── */
  .p-table { width: 100%; border-collapse: collapse; }
  .p-table th {
    padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 700;
    color: #94a3b8; letter-spacing: .8px; text-transform: uppercase;
    border-bottom: 1px solid var(--card-border); background: #fafbfc;
  }
  .p-table td {
    padding: 13px 16px; border-bottom: 1px solid #f8fafc;
    font-size: 13px; color: #334155;
  }
  .p-table tbody tr:last-child td { border-bottom: none; }
  .p-table tbody tr:hover { background: #fafcff; }

  /* ── BADGES ── */
  .p-badge {
    display: inline-flex; align-items: center; padding: 4px 12px;
    border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap;
  }
  .p-badge-up   { background: #dcfce7; color: #15803d; }
  .p-badge-down { background: #fee2e2; color: #b91c1c; }
  .p-badge-same { background: #fef9c3; color: #a16207; }

  /* ── MISC ── */
  .p-mat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .p-mini-bar { height: 4px; background: #f1f5f9; border-radius: 4px; overflow: hidden; width: 54px; }
  .p-mini-bar > div { height: 100%; border-radius: 4px; }
  .p-filter-pill {
    padding: 7px 16px; border-radius: 20px; border: 1.5px solid var(--card-border);
    background: #fff; color: #64748b; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .18s;
  }
  .p-filter-pill:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
  .p-filter-pill.active { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }
  .p-info-banner {
    background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 12px;
    padding: 13px 18px; font-size: 13px; color: #1e40af; line-height: 1.6; margin-top: 16px;
  }
  .p-warn-banner {
    background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: 10px;
    padding: 11px 14px; font-size: 12px; color: #b91c1c; line-height: 1.6; margin-top: 14px;
  }
  .p-progress-track { height: 10px; background: #f1f5f9; border-radius: 8px; overflow: hidden; }
  .p-progress-fill {
    height: 100%; border-radius: 8px;
    background: linear-gradient(90deg, #4f8ef7, #22c55e); transition: width .6s ease;
  }
  .p-abs-grid {
    display: grid; grid-template-columns: 220px 1fr; gap: 16px; margin-top: 20px;
  }
  .p-abs-panel {
    background: #fff; border-radius: 16px; border: 1px solid var(--card-border);
    padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .p-abs-panel-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  .p-abs-panel-sub   { font-size: 12px; color: #94a3b8; margin-bottom: 14px; }
  .p-abs-summary {
    display: flex; justify-content: space-between; margin-top: 16px;
    padding-top: 14px; border-top: 1px solid var(--card-border);
  }
  .p-sum-stat { text-align: center; }
  .p-sum-num  { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 900; }
  .p-sum-lbl  { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: .5px; }
  .p-bar-chart { display: flex; gap: 6px; align-items: flex-end; height: 70px; padding: 0 2px; }
  .p-bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .p-bar-wrap  {
    width: 100%; height: 60px; background: #f8fafc; border-radius: 6px; overflow: hidden;
    border: 1px solid #e8edf5; display: flex; align-items: flex-end;
  }
  .p-bar-fill  { width: 100%; transition: height .8s ease; border-radius: 4px 4px 0 0; }
  .p-bar-lbl   { font-size: 8px; color: #94a3b8; font-weight: 700; letter-spacing: .04em; }

  @media (max-width: 900px) {
    .p-profile-level { display: none; }
    .p-abs-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .p-layout { flex-direction: column; }
    .p-sidebar { width: 100%; height: auto; min-width: unset; }
    .p-main { padding: 16px; }
    .p-profile-card { flex-direction: column; text-align: center; }
  }
`;

// ── DONNÉES PARENT ────────────────────────────────────────────
const PARENT = { nom: 'M. Hadj Karim', initials: 'HK' };

const ENFANTS = [
  {
    id: 1, nom: 'Sara Hadj', initials: 'SH',
    classe: '3ème A', numero: 'INS-2024-0042', annee: '2025 / 2026', color: '#4f8ef7',
    notes: [
      { matiere:'Mathématiques', icon:'📐', color:'#4f8ef7', bg:'#EFF6FF', coef:4, d1:14, d2:16, ex:17, appr:'Très bien'  },
      { matiere:'Informatique',  icon:'💻', color:'#22c55e', bg:'#F0FDF4', coef:3, d1:18, d2:17, ex:19, appr:'Excellent'  },
      { matiere:'Physique',      icon:'⚗️', color:'#f97316', bg:'#FFF7ED', coef:3, d1:13, d2:14, ex:15, appr:'Bien'       },
      { matiere:'Français',      icon:'🇫🇷', color:'#6366f1', bg:'#EEF2FF', coef:2, d1:12, d2:13, ex:14, appr:'Assez bien' },
      { matiere:'Arabe',         icon:'📖', color:'#ec4899', bg:'#FDF2F8', coef:3, d1:15, d2:16, ex:14, appr:'Très bien'  },
      { matiere:'Anglais',       icon:'🇬🇧', color:'#14b8a6', bg:'#F0FDFA', coef:2, d1:11, d2:12, ex:13, appr:'Assez bien' },
    ],
    rang: '3ème / 28',
    absences: [
      { matiere:'Mathématiques', date:'03/02/2026', justif:false, motif:null,                     color:'#4f8ef7' },
      { matiere:'Français',      date:'17/02/2026', justif:true,  motif:'Certificat médical',     color:'#6366f1' },
      { matiere:'Physique',      date:'05/03/2026', justif:false, motif:null,                     color:'#f97316' },
      { matiere:'Anglais',       date:'22/03/2026', justif:true,  motif:'Convocation officielle', color:'#14b8a6' },
    ],
    paiements: [
      { id:1,  mois:'Septembre', montant:2500, statut:'payé',       date:'05/09/2025', methode:'Espèces'  },
      { id:2,  mois:'Octobre',   montant:2500, statut:'payé',       date:'03/10/2025', methode:'Virement' },
      { id:3,  mois:'Novembre',  montant:2500, statut:'payé',       date:'07/11/2025', methode:'Espèces'  },
      { id:4,  mois:'Décembre',  montant:2500, statut:'payé',       date:'02/12/2025', methode:'Espèces'  },
      { id:5,  mois:'Janvier',   montant:2500, statut:'payé',       date:'06/01/2026', methode:'Virement' },
      { id:6,  mois:'Février',   montant:2500, statut:'payé',       date:'04/02/2026', methode:'Espèces'  },
      { id:7,  mois:'Mars',      montant:2500, statut:'payé',       date:'03/03/2026', methode:'Espèces'  },
      { id:8,  mois:'Avril',     montant:2500, statut:'en attente', date:null,         methode:null       },
      { id:9,  mois:'Mai',       montant:2500, statut:'non payé',   date:null,         methode:null       },
      { id:10, mois:'Juin',      montant:2500, statut:'non payé',   date:null,         methode:null       },
    ],
  },
  {
    id: 2, nom: 'Yacine Hadj', initials: 'YH',
    classe: '1ère S', numero: 'INS-2023-0019', annee: '2025 / 2026', color: '#f97316',
    notes: [
      { matiere:'Mathématiques', icon:'📐', color:'#4f8ef7', bg:'#EFF6FF', coef:5, d1:17, d2:18, ex:16, appr:'Excellent' },
      { matiere:'Physique',      icon:'⚗️', color:'#f97316', bg:'#FFF7ED', coef:4, d1:15, d2:14, ex:16, appr:'Très bien' },
      { matiere:'SVT',           icon:'🌿', color:'#22c55e', bg:'#F0FDF4', coef:3, d1:13, d2:14, ex:15, appr:'Bien'      },
      { matiere:'Français',      icon:'🇫🇷', color:'#6366f1', bg:'#EEF2FF', coef:2, d1:11, d2:12, ex:10, appr:'Passable'  },
      { matiere:'Arabe',         icon:'📖', color:'#ec4899', bg:'#FDF2F8', coef:3, d1:14, d2:15, ex:13, appr:'Bien'      },
      { matiere:'Anglais',       icon:'🇬🇧', color:'#14b8a6', bg:'#F0FDFA', coef:2, d1:13, d2:14, ex:14, appr:'Bien'      },
    ],
    rang: '5ème / 32',
    absences: [
      { matiere:'Physique',      date:'10/01/2026', justif:true,  motif:'Rendez-vous médical', color:'#f97316' },
      { matiere:'Mathématiques', date:'14/02/2026', justif:false, motif:null,                  color:'#4f8ef7' },
    ],
    paiements: [
      { id:1,  mois:'Septembre', montant:3000, statut:'payé',     date:'04/09/2025', methode:'Virement' },
      { id:2,  mois:'Octobre',   montant:3000, statut:'payé',     date:'02/10/2025', methode:'Espèces'  },
      { id:3,  mois:'Novembre',  montant:3000, statut:'payé',     date:'06/11/2025', methode:'Virement' },
      { id:4,  mois:'Décembre',  montant:3000, statut:'payé',     date:'01/12/2025', methode:'Espèces'  },
      { id:5,  mois:'Janvier',   montant:3000, statut:'payé',     date:'07/01/2026', methode:'Virement' },
      { id:6,  mois:'Février',   montant:3000, statut:'payé',     date:'05/02/2026', methode:'Espèces'  },
      { id:7,  mois:'Mars',      montant:3000, statut:'payé',     date:'04/03/2026', methode:'Virement' },
      { id:8,  mois:'Avril',     montant:3000, statut:'payé',     date:'02/04/2026', methode:'Espèces'  },
      { id:9,  mois:'Mai',       montant:3000, statut:'non payé', date:null,         methode:null       },
      { id:10, mois:'Juin',      montant:3000, statut:'non payé', date:null,         methode:null       },
    ],
  },
];

// ── UTILS ─────────────────────────────────────────────────────
const moy3 = (n) => ((n.d1 + n.d2 + n.ex) / 3).toFixed(2);
const moyC = (v) => { const f = parseFloat(v); return f >= 14 ? '#4f8ef7' : f >= 10 ? '#f97316' : '#ef4444'; };
const barC = (v) => v >= 14 ? '#4f8ef7' : v >= 10 ? '#f97316' : '#ef4444';
const paiS = (s) => ({
  'payé':       { bg:'#dcfce7', color:'#15803d', label:'✅ Payé'       },
  'en attente': { bg:'#fef9c3', color:'#a16207', label:'⏳ En attente' },
  'non payé':   { bg:'#fee2e2', color:'#b91c1c', label:'✗ Non payé'   },
}[s] || {});

// ══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function Parent() {
    const navigate = useNavigate();

  const [page,       setPage]       = useState('notes');
  const [enfantId,   setEnfantId]   = useState(1);
  const [showPicker, setShowPicker] = useState(false);
const [showUserMenu, setShowUserMenu] = useState(false);
  useEffect(() => {
    const id = 'parent-global-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const enfant = ENFANTS.find(e => e.id === enfantId);
  const NAV = [
    { id:'notes',    icon:'📝', label:'Notes & Évaluations' },
    { id:'absences', icon:'📋', label:'Absences'            },
    { id:'paiement', icon:'💳', label:'Paiements'           },
  ];

  return (
    <div className="p-layout">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className="p-sidebar">
            <img src="/logo.png" width="150" alt="logo" />


        {/* Sélecteur enfant */}
        <div className="p-child-block">
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>
            MON ENFANT
          </div>
          <div className="p-child-select" onClick={() => setShowPicker(v => !v)}>
            <div style={{
              width:34, height:34, borderRadius:'50%', flexShrink:0,
              background:`linear-gradient(135deg, ${enfant.color}, #6366f1)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:800, color:'#fff',
            }}>{enfant.initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{enfant.nom}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>{enfant.classe}</div>
            </div>
            <span style={{ color:'rgba(255,255,255,.4)', fontSize:11 }}>{showPicker ? '▴' : '▾'}</span>
          </div>
          {showPicker && (
            <div className="p-child-dropdown">
              {ENFANTS.map(e => (
                <div key={e.id} className="p-child-opt"
                  style={{
                    background: e.id === enfantId ? 'rgba(79,142,247,.18)' : 'transparent',
                    borderLeft: e.id === enfantId ? `3px solid ${e.color}` : '3px solid transparent',
                  }}
                  onClick={() => { setEnfantId(e.id); setShowPicker(false); }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%',
                    background:`linear-gradient(135deg, ${e.color}, #6366f1)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:11, fontWeight:800, color:'#fff', flexShrink:0,
                  }}>{e.initials}</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{e.nom}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>{e.classe}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="p-section-label" style={{ marginTop:6 }}>CONSULTER</span>
        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} className={`p-nav-item${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
              <span className="p-nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div className="p-sidebar-user">
          <div className="p-sidebar-avatar" style={{ background:'linear-gradient(135deg,#f97316,#ec4899)' }}>{PARENT.initials}</div>
          <div>
            <div className="p-sidebar-name">{PARENT.nom}</div>
            <div className="p-sidebar-role">Parent · Espace famille</div>
          </div>
           <span className="sidebar-arrow" onClick={()=>navigate('/login')}>←</span>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────── */}
      <main className="p-main">
        {/* Banner enfant */}
        <div className="p-profile-card">
          <div className="p-profile-avatar" style={{ background:`linear-gradient(135deg, ${enfant.color}, #6366f1)` }}>
            {enfant.initials}
          </div>
          <div style={{ flex:1 }}>
            <div className="p-profile-name">{enfant.nom}</div>
            <div className="p-profile-sub">{enfant.classe} · {enfant.annee} · {enfant.numero}</div>
          </div>
          <div className="p-profile-level">
            <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', marginBottom:6, textTransform:'uppercase', letterSpacing:.8 }}>Scolarité</div>
            <div className="p-level-pill" style={{ justifyContent:'center' }}>
              <span style={{ color:'#22c55e', marginRight:5 }}>●</span> Active
            </div>
          </div>
        </div>

        {page === 'notes'    && <PageNotes    enfant={enfant} />}
        {page === 'absences' && <PageAbsences enfant={enfant} />}
        {page === 'paiement' && <PagePaiement enfant={enfant} />}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE NOTES
// ══════════════════════════════════════════════════════════════
function PageNotes({ enfant }) {
  const { notes, rang } = enfant;
  const totalCoef = notes.reduce((s, n) => s + n.coef, 0);
  const moyGen = (notes.reduce((s, n) => s + parseFloat(moy3(n)) * n.coef, 0) / totalCoef).toFixed(2);

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <h1 className="p-page-title" style={{ margin:0 }}>Notes & Évaluations</h1>
        <div style={{ fontSize:12, color:'#94a3b8' }}>{enfant.classe} — {enfant.annee} — Trimestre 2</div>
      </div>

      <div className="p-stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        <div className="p-stat-card blue">
          <span className="p-stat-icon">📊</span>
          <div className="p-stat-number" style={{ color: moyC(moyGen) }}>{moyGen}/20</div>
          <div className="p-stat-label">Moyenne générale</div>
          <div className="p-stat-sub">Toutes matières</div>
        </div>
        <div className="p-stat-card green">
          <span className="p-stat-icon">🏅</span>
          <div className="p-stat-number" style={{ color:'#4f8ef7', fontSize:20 }}>{rang}</div>
          <div className="p-stat-label">Classement</div>
          <div className="p-stat-sub">Dans la classe</div>
        </div>
        <div className="p-stat-card orange">
          <span className="p-stat-icon">📚</span>
          <div className="p-stat-number">{notes.length}</div>
          <div className="p-stat-label">Matières</div>
          <div className="p-stat-sub">Ce trimestre</div>
        </div>
      </div>

      <div className="p-card">
        <div className="p-card-header">
          <h3>Bulletin de notes — {enfant.nom}</h3>
          <span className="p-count-badge">{notes.length} matières</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="p-table">
            <thead>
              <tr>
                <th>MATIÈRE</th><th>COEFF.</th>
                <th>DEVOIR 1</th><th>DEVOIR 2</th><th>EXAMEN</th>
                <th>MOYENNE</th><th style={{ width:60 }}>BAR</th><th>APPRÉCIATION</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => {
                const m = moy3(n); const mc = moyC(m);
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div className="p-mat-icon" style={{ background:n.bg, color:n.color }}>{n.icon}</div>
                        <span style={{ fontWeight:600, fontSize:13 }}>{n.matiere}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:700, color:'#334155' }}>{n.coef}</td>
                    {[n.d1, n.d2, n.ex].map((v, j) => (
                      <td key={j}>
                        <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:20, background:barC(v)+'18', color:barC(v), fontSize:12, fontWeight:700 }}>
                          {v}/20
                        </span>
                      </td>
                    ))}
                    <td>
                      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:mc }}>
                        {m}/20
                      </span>
                    </td>
                    <td>
                      <div className="p-mini-bar">
                        <div style={{ width:`${(parseFloat(m)/20)*100}%`, background:mc }} />
                      </div>
                    </td>
                    <td style={{ fontSize:12, color:'#64748b' }}>{n.appr}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:'2px solid #e8edf5' }}>
                <td colSpan={5} style={{ fontWeight:700, fontSize:14, color:'#1e293b', padding:'14px 16px' }}>Moyenne Générale</td>
                <td>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:900, color:moyC(moyGen) }}>
                    {moyGen} / 20
                  </span>
                </td>
                <td />
                <td><span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, color:'#4f8ef7' }}>{rang}</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="p-info-banner">
        ℹ️ Ces notes correspondent au <strong>Trimestre 2</strong> de l'année scolaire {enfant.annee}.
        Pour toute question, veuillez contacter l'administration de l'établissement.
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE ABSENCES
// ══════════════════════════════════════════════════════════════
function PageAbsences({ enfant }) {
  const abs = enfant.absences;
  const total = abs.length, justif = abs.filter(a => a.justif).length, nonJust = total - justif;
  const parMat = abs.reduce((acc, a) => {
    acc[a.matiere] = acc[a.matiere] || { count:0, color:a.color };
    acc[a.matiere].count++;
    return acc;
  }, {});

  return (
    <>
      <h1 className="p-page-title">Absences — {enfant.nom}</h1>
      <div className="p-stats-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        <div className="p-stat-card blue">
          <span className="p-stat-icon">📋</span>
          <div className="p-stat-number">{total}</div>
          <div className="p-stat-label">Total absences</div>
          <div className="p-stat-sub">Ce trimestre</div>
        </div>
        <div className="p-stat-card orange">
          <span className="p-stat-icon">✅</span>
          <div className="p-stat-number" style={{ color:'#22c55e' }}>{justif}</div>
          <div className="p-stat-label">Justifiées</div>
          <div className="p-stat-sub">Avec justificatif</div>
        </div>
        <div className="p-stat-card red">
          <span className="p-stat-icon">⚠️</span>
          <div className="p-stat-number">{nonJust}</div>
          <div className="p-stat-label">Non justifiées</div>
          <div className="p-stat-sub">À régulariser</div>
        </div>
      </div>

      <div className="p-abs-grid">
        <div className="p-abs-panel">
          <div className="p-abs-panel-title">Répartition par matière</div>
          <div className="p-abs-panel-sub">Absences enregistrées</div>
          {Object.entries(parMat).map(([mat, info]) => (
            <div key={mat} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #f8fafc' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:info.color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{mat}</span>
              <span style={{ background:info.color+'18', color:info.color, padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                {info.count} abs.
              </span>
            </div>
          ))}
          <div className="p-abs-summary">
            <div className="p-sum-stat"><div className="p-sum-num" style={{ color:'#1e293b' }}>{total}</div><div className="p-sum-lbl">TOTAL</div></div>
            <div className="p-sum-stat"><div className="p-sum-num" style={{ color:'#22c55e' }}>{justif}</div><div className="p-sum-lbl">JUSTIF.</div></div>
            <div className="p-sum-stat"><div className="p-sum-num" style={{ color:'#ef4444' }}>{nonJust}</div><div className="p-sum-lbl">NON JUST.</div></div>
          </div>
          {nonJust > 0 && (
            <div className="p-warn-banner">
              ⚠️ <strong>{nonJust} absence{nonJust > 1 ? 's' : ''} non justifiée{nonJust > 1 ? 's' : ''}</strong> — veuillez fournir un justificatif à l'administration.
            </div>
          )}
        </div>

        <div className="p-card" style={{ marginBottom:0 }}>
          <div className="p-card-header">
            <h3>Historique des absences</h3>
            <span className="p-count-badge">{total} entrée{total > 1 ? 's' : ''}</span>
          </div>
          <table className="p-table">
            <thead><tr><th>MATIÈRE</th><th>DATE</th><th>STATUT</th><th>MOTIF</th></tr></thead>
            <tbody>
              {abs.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign:'center', color:'#94a3b8', padding:28, fontStyle:'italic' }}>Aucune absence ce trimestre 🎉</td></tr>
              ) : abs.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:4, height:36, borderRadius:4, background:a.color, flexShrink:0 }} />
                      <span style={{ fontWeight:600, fontSize:13 }}>{a.matiere}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:13, fontWeight:500 }}>{a.date}</td>
                  <td><span className={`p-badge ${a.justif ? 'p-badge-up' : 'p-badge-down'}`}>{a.justif ? '✅ Justifiée' : '⚠️ Non justif.'}</span></td>
                  <td style={{ fontSize:12, color:'#94a3b8', fontStyle:a.motif ? 'normal' : 'italic' }}>{a.motif || '—'}</td>
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
// PAGE PAIEMENT
// ══════════════════════════════════════════════════════════════
function PagePaiement({ enfant }) {
  const [filtre, setFiltre] = useState('tous');
  const paie    = enfant.paiements;
  const paye    = paie.filter(p => p.statut === 'payé');
  const attente = paie.filter(p => p.statut === 'en attente');
  const nonPaye = paie.filter(p => p.statut === 'non payé');

  const totalPaye  = paye.reduce((s, p) => s + p.montant, 0);
  const totalAnnee = paie.reduce((s, p) => s + p.montant, 0);
  const totalRest  = (attente.length + nonPaye.length) * (paie[0]?.montant || 0);
  const pct        = Math.round((totalPaye / totalAnnee) * 100);

  const filtered = filtre === 'tous' ? paie : filtre === 'payé' ? paye : filtre === 'en attente' ? attente : nonPaye;

  const barData = paie.map(p => ({
    mois:  p.mois.slice(0, 3),
    pct:   p.statut === 'payé' ? 100 : p.statut === 'en attente' ? 50 : 0,
    color: p.statut === 'payé' ? '#22c55e' : p.statut === 'en attente' ? '#f59e0b' : '#e2e8f0',
  }));

  return (
    <>
      <h1 className="p-page-title">💳 Paiements — {enfant.nom}</h1>

      <div className="p-stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        <div className="p-stat-card green">
          <span className="p-stat-icon">✅</span>
          <div className="p-stat-number" style={{ color:'#15803d' }}>{paye.length}</div>
          <div className="p-stat-label">Mois payés</div>
          <div className="p-stat-sub" style={{ color:'#15803d', fontWeight:700 }}>{totalPaye.toLocaleString()} DA</div>
        </div>
        <div className="p-stat-card orange">
          <span className="p-stat-icon">⏳</span>
          <div className="p-stat-number" style={{ color:'#d97706' }}>{attente.length}</div>
          <div className="p-stat-label">En attente</div>
          <div className="p-stat-sub">À confirmer</div>
        </div>
        <div className="p-stat-card red">
          <span className="p-stat-icon">❌</span>
          <div className="p-stat-number" style={{ color:'#dc2626' }}>{nonPaye.length}</div>
          <div className="p-stat-label">Non payés</div>
          <div className="p-stat-sub" style={{ color:'#dc2626', fontWeight:700 }}>{totalRest.toLocaleString()} DA</div>
        </div>
        <div className="p-stat-card blue">
          <span className="p-stat-icon">📊</span>
          <div className="p-stat-number" style={{ color:'#4f8ef7' }}>{pct}%</div>
          <div className="p-stat-label">Progression</div>
          <div className="p-stat-sub">{paye.length} / {paie.length} mois</div>
        </div>
      </div>

      {/* Graphique */}
      <div className="p-card" style={{ padding:20 }}>
        <div className="p-card-header" style={{ padding:'0 0 14px', border:'none' }}>
          <h3>📊 Statistique — {enfant.annee}</h3>
          <span className="p-count-badge">{totalPaye.toLocaleString()} / {totalAnnee.toLocaleString()} DA</span>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Taux de paiement annuel</span>
            <span style={{ fontSize:14, fontWeight:800, color:'#4f8ef7' }}>{pct}%</span>
          </div>
          <div className="p-progress-track">
            <div className="p-progress-fill" style={{ width:`${pct}%` }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            <span style={{ fontSize:11, color:'#94a3b8' }}>0 DA</span>
            <span style={{ fontSize:11, color:'#94a3b8' }}>{totalAnnee.toLocaleString()} DA</span>
          </div>
        </div>
        <div className="p-bar-chart">
          {barData.map((b, i) => (
            <div key={i} className="p-bar-col">
              <div className="p-bar-wrap">
                <div className="p-bar-fill" style={{ height:`${Math.max(b.pct, 0)}%`, background:b.color, minHeight: b.pct > 0 ? 6 : 0 }} />
              </div>
              <span className="p-bar-lbl">{b.mois}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:20, marginTop:16, flexWrap:'wrap' }}>
          {[['#22c55e','Payé'],['#f59e0b','En attente'],['#e2e8f0','Non payé']].map(([c,l]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#64748b', fontWeight:600 }}>
              <div style={{ width:12, height:12, borderRadius:4, background:c, border:'1px solid rgba(0,0,0,.08)' }} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        {[
          { key:'tous',       label:`Tous (${paie.length})`           },
          { key:'payé',       label:`✅ Payés (${paye.length})`       },
          { key:'en attente', label:`⏳ En attente (${attente.length})` },
          { key:'non payé',   label:`❌ Non payés (${nonPaye.length})`},
        ].map(f => (
          <button key={f.key} className={`p-filter-pill${filtre === f.key ? ' active' : ''}`} onClick={() => setFiltre(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="p-card">
        <div className="p-card-header">
          <h3>Liste des paiements mensuels</h3>
          <span className="p-count-badge">{filtered.length} mois</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="p-table">
            <thead>
              <tr><th>MOIS</th><th>MONTANT</th><th>STATUT</th><th>DATE PAIEMENT</th><th>MÉTHODE</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const st = paiS(p.statut);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{
                          width:36, height:36, borderRadius:10, flexShrink:0,
                          background: p.statut==='payé'?'#dcfce7':p.statut==='en attente'?'#fef9c3':'#fee2e2',
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
                        }}>
                          {p.statut==='payé'?'✅':p.statut==='en attente'?'⏳':'📅'}
                        </div>
                        <span style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{p.mois}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight:800, fontSize:15, color:'#1e293b', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        {p.montant.toLocaleString()}<span style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}> DA</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ background:st.bg, color:st.color, padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ fontSize:13, color:p.date?'#334155':'#cbd5e1', fontStyle:p.date?'normal':'italic' }}>{p.date || '—'}</td>
                    <td>
                      {p.methode
                        ? <span style={{ background:'#f1f5f9', padding:'3px 10px', borderRadius:12, fontSize:12, fontWeight:600, color:'#475569' }}>
                            {p.methode==='Espèces'?'💵':'🏦'} {p.methode}
                          </span>
                        : <span style={{ color:'#cbd5e1', fontSize:12 }}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', background:'#f8fafc', borderTop:'1px solid #e8edf5' }}>
          <span style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Total payé cette année</span>
          <span style={{ fontSize:17, fontWeight:800, color:'#22c55e', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            {totalPaye.toLocaleString()} DA
            <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}> / {totalAnnee.toLocaleString()} DA</span>
          </span>
        </div>
      </div>

      <div className="p-info-banner">
        ℹ️ Le montant mensuel est de <strong>{paie[0]?.montant.toLocaleString()} DA</strong>.
        Pour tout paiement ou réclamation, veuillez vous adresser au secrétariat de l'établissement.
      </div>
    </>
  );
}