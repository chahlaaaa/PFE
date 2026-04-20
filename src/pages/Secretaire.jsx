import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGO = (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <rect width="56" height="56" rx="14" fill="#4f8ef7"/>
    <text x="28" y="38" textAnchor="middle" fontSize="28" fill="white" fontFamily="Arial">🎓</text>
  </svg>
)

// ── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate()
  const items = [
    { key:'dashboard',    label:'Tableau de bord', icon:'📊' },
    { key:'inscriptions', label:'Inscriptions',    icon:'📋' },
    { key:'formulaire',   label:'Formulaire',      icon:'📄' },
  ]
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-block">
        <div className="sidebar-logo-img">{LOGO}</div>
        <div className="sidebar-logo-text">أكاديمية سبل النجاح</div>
      </div>
      <span className="sidebar-section-label">Mon Espace</span>
      {items.map(item=>(
        <button key={item.key}
          className={`nav-item ${activePage===item.key?'active':''}`}
          onClick={()=>onNavigate(item.key)}>
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sidebar-user">
        <div className="sidebar-avatar">BS</div>
        <div className="sidebar-user-info">
          <div className="name">Bouteldja Salwa</div>
          <div className="role">Secrétaire</div>
        </div>
        <span className="sidebar-arrow" onClick={()=>navigate('/login')}>←</span>
      </div>
    </aside>
  )
}

function SearchBar() {
  return (
    <div className="sec-search-bar">
      <span>🔍</span>
      <input placeholder="Rechercher..." />
      <span>🎤</span>
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const stats = [
    { num:247, label:'Élèves inscrits',     sub:'Total actifs', cls:'blue',   icon:'👥' },
    { num:5,   label:'Dossiers en attente', sub:'À traiter',    cls:'orange', icon:'📝' },
    { num:12,  label:'Dossiers traités',    sub:'Ce mois',      cls:'green',  icon:'✅' },
  ]
  const dossiers = [
    { name:'Malak Hamza',    niveau:'B2', date:'17/02/2026', docs:'manquant', docsBg:'#fef2f2', docsColor:'#ef4444', action:'traiter', aBg:'#f1f5f9', aColor:'#64748b' },
    { name:'Abdennour Taha', niveau:'A1', date:'17/02/2026', docs:'complet',  docsBg:'#e6f7f5', docsColor:'#0d9488', action:'valider', aBg:'#22c55e', aColor:'#fff'    },
    { name:'Mostafa BenAli', niveau:'A1', date:'16/02/2026', docs:'complet',  docsBg:'#e6f7f5', docsColor:'#0d9488', action:'valider', aBg:'#22c55e', aColor:'#fff'    },
  ]
  const numColors = { blue:'#4f8ef7', orange:'#f97316', green:'#22c55e' }

  return (
    <main className="main-content">
      <div className="sec-top-bar">
        <h1 className="page-title">Tableau de bord</h1>
        <SearchBar />
      </div>
      <div className="sec-stats-grid">
        {stats.map(st=>(
          <div key={st.label} className={`stat-card ${st.cls}`}>
            <span className="stat-icon">{st.icon}</span>
            <div className="stat-number" style={{color:numColors[st.cls]}}>{st.num}</div>
            <div className="stat-label">{st.label}</div>
            <div className="stat-sub">{st.sub}</div>
          </div>
        ))}
      </div>
      <div className="notes-card">
        <div className="notes-card-header">
          <h3>Dossiers d'inscription en attente</h3>
        </div>
        <table className="notes-table" style={{tableLayout:'auto'}}>
          <thead>
            <tr>{['Nom','Niveau demandé','Date demande','Documents','Action'].map(h=><th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {dossiers.map((d,i)=>(
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.niveau}</td>
                <td>{d.date}</td>
                <td><span className="dossier-badge" style={{background:d.docsBg,color:d.docsColor}}>{d.docs}</span></td>
                <td><button className="dossier-btn" style={{background:d.aBg,color:d.aColor}}>{d.action}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

// ── INSCRIPTIONS (avec langue flags) ─────────────────────────
function Inscriptions() {
  const LANGUES = [
    { value:'fr', label:'Français', flag:'🇫🇷' },
    { value:'en', label:'Anglais',  flag:'🇬🇧' },
    { value:'de', label:'Deutsch',  flag:'🇩🇪' },
  ]
  const [langue, setLangue] = useState('')

  return (
    <main className="main-content">
      <div className="sec-top-bar">
        <h1 className="page-title">Inscriptions</h1>
        <SearchBar />
      </div>
      <div className="form-card">
        <div className="form-card-title">Informations de l'étudiant</div>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Prénom*</label>
            <input className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Nom de famille*</label>
            <input className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Date de naissance*</label>
            <input className="form-input" type="date" />
          </div>
          <div className="form-field">
            <label className="form-label">Niveau*</label>
            <select className="form-select">
              <option value="">-- Sélectionner --</option>
              {['A1','A2','B1','B2','C1','C2'].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
          {/* Langue avec drapeaux */}
          <div className="form-field">
            <label className="form-label">Langue étudiée*</label>
            <div className="langue-select-wrap">
              {LANGUES.map(l=>(
                <button key={l.value} type="button"
                  className={`langue-btn ${langue===l.value?'active':''}`}
                  onClick={()=>setLangue(l.value)}>
                  <span className="langue-flag">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Nom du parent (optionnel)</label>
            <input className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Téléphone*</label>
            <input className="form-input" placeholder="0xxx xxx xxx" />
          </div>
          <div className="form-field full-width">
            <label className="form-label">Adresse*</label>
            <input className="form-input" placeholder="Rue, Cité, Wilaya" />
          </div>
          <div className="form-field">
            <label className="form-label">Dossier complet*</label>
            <div className="radio-group">
              <label><input type="radio" name="dossier" defaultChecked /> oui</label>
              <label><input type="radio" name="dossier" /> non</label>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-success">Enregistrer</button>
          <button className="btn-annuler">Annuler</button>
        </div>
      </div>
    </main>
  )
}

// ── FORMULAIRE ────────────────────────────────────────────────
function Formulaire() {
  return (
    <main className="main-content">
      <div className="sec-top-bar">
        <h1 className="page-title">Formulaire</h1>
        <SearchBar />
      </div>
      <div className="formulaire-wrap">
        <div className="formulaire-title">Formulaire d'inscription :</div>
        <div className="pdf-row">
          <div className="pdf-box">
            <div className="pdf-left">
              <div className="pdf-icon">📄</div>
              <div>
                <div className="pdf-name">formulaire.pdf</div>
                <div className="pdf-desc">Document d'inscription officiel</div>
              </div>
            </div>
            <div className="pdf-actions">
              <button className="btn-download">⬇ Télécharger</button>
              <button className="btn-pdf-delete">✕</button>
            </div>
          </div>
          <button className="btn-imprimer">🖨 Imprimer</button>
        </div>
      </div>
    </main>
  )
}

// ── PAGE PRINCIPALE SECRÉTAIRE ────────────────────────────────
export default function Secretaire() {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      {page==='dashboard'    && <Dashboard    onNavigate={setPage} />}
      {page==='inscriptions' && <Inscriptions />}
      {page==='formulaire'   && <Formulaire />}
    </div>
  )
}
