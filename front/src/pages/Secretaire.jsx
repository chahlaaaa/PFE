import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = "http://localhost:3000/api";

// ── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate()
  const items = [
    { key:'dashboard',    label:'Tableau de bord', icon:'📊' },
    { key:'inscriptions', label:'Inscriptions',    icon:'📋' },
    { key:'formulaire',   label:'Formulaire',      icon:'📄' },
    { key:'payment',      label:'Paiement',        icon:'💳' },
  ]
  return (
    <aside className="sidebar">
      <div className="logo-area" style={{padding:'20px', textAlign:'center'}}>
         <h2 style={{color:'#4f8ef7'}}>EduManager</h2>
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

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ eleves }) {
  const stats = [
    { num: eleves.length, label:'Élèves inscrits', sub:'Total actifs', cls:'blue', icon:'👥' },
    { num: eleves.filter(e => e.statut !== 'payé').length, label:'Dossiers en attente', sub:'À traiter', cls:'orange', icon:'📝' },
    { num: eleves.filter(e => e.statut === 'payé').length, label:'Dossiers traités', sub:'Ce mois', cls:'blue', icon:'✅' },
  ]
  const numColors = { blue:'#4f8ef7', orange:'#f97316', green:'#22c55e' }

  return (
    <main className="main-content">
      <h1 className="page-title">Tableau de bord</h1>
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
        <h3>Dossiers d'inscription récents</h3>
        <table className="notes-table">
          <thead>
            <tr><th>Nom</th><th>Niveau</th><th>Statut</th><th>Action</th></tr>
          </thead>
          <tbody>
            {eleves.slice(-3).reverse().map((e, i) => (
              <tr key={i}>
                <td>{e.nom}</td>
                <td>{e.niveau}</td>
                <td>
                  <span className="dossier-badge" style={{
                    background: e.statut==='payé' ? '#e6f7f5':'#fef2f2',
                    color: e.statut==='payé' ? '#0d9488':'#ef4444'
                  }}>{e.statut}</span>
                </td>
                <td><button className="dossier-btn" style={{background:'#f1f5f9', color:'#64748b'}}>Détails</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

// ── INSCRIPTIONS ──────────────────────────────────────────────
function Inscriptions({ onRefresh }) {
  const LANGUES = [
    { value:'fr', label:'Français', flag:'🇫🇷' },
    { value:'en', label:'Anglais',  flag:'🇬🇧' },
    { value:'de', label:'Deutsch',  flag:'🇩🇪' },
  ]
  const [formData, setFormData] = useState({
    prenom:'', nom:'', dateNais:'', niveau:'', langue:'', telephone:'', adresse:''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/students`, {
        nom: `${formData.prenom} ${formData.nom}`,
        niveau: formData.niveau,
        langue: formData.langue,
        telephone: formData.telephone,
        statut: 'non payé'
      })
      alert("Inscrit avec succès !")
      onRefresh()
    } catch (err) { alert("Erreur d'inscription") }
  }

  return (
    <main className="main-content">
      <h1 className="page-title">Inscriptions</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Prénom*</label>
            <input className="form-input" required onChange={e=>setFormData({...formData, prenom:e.target.value})} />
          </div>
          <div className="form-field">
            <label className="form-label">Nom de famille*</label>
            <input className="form-input" required onChange={e=>setFormData({...formData, nom:e.target.value})} />
          </div>
          <div className="form-field">
            <label className="form-label">Niveau*</label>
            <select className="form-select" required onChange={e=>setFormData({...formData, niveau:e.target.value})}>
              <option value="">-- Sélectionner --</option>
              {['A1','A2','B1','B2','C1','C2'].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Langue étudiée*</label>
            <div className="langue-select-wrap">
              {LANGUES.map(l=>(
                <button key={l.value} type="button" 
                  className={`langue-btn ${formData.langue===l.label?'active':''}`}
                  onClick={()=>setFormData({...formData, langue:l.label})}>
                  <span className="langue-flag">{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Téléphone*</label>
            <input className="form-input" required onChange={e=>setFormData({...formData, telephone:e.target.value})} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-success">Enregistrer</button>
        </div>
      </form>
    </main>
  )
}

// ── PAYMENT ───────────────────────────────────────────────────
function Payment({ eleves, onUpdate }) {
  const [search, setSearch] = useState('')
  const filtered = eleves.filter(e => e.nom.toLowerCase().includes(search.toLowerCase()))
  
  const nbPayes = eleves.filter(e => e.statut === 'payé').length
  const totalPercu = eleves.filter(e => e.statut === 'payé').reduce((s,e) => s + (Number(e.montant) || 3000), 0)
  const taux = Math.round((nbPayes / (eleves.length || 1)) * 100)

  return (
    <main className="main-content">
      <div className="sec-top-bar">
        <h1 className="page-title">Paiements</h1>
        <div className="sec-search-bar">
          <span>🔍</span>
          <input placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="sec-stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">{totalPercu} DA</div>
          <div className="stat-label">Total perçu</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{taux}%</div>
          <div className="stat-label">Taux de paiement</div>
        </div>
      </div>

      <div className="notes-card">
        <table className="notes-table">
          <thead>
            <tr><th>Nom</th><th>Niveau</th><th>Statut</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td style={{fontWeight:600}}>{e.nom}</td>
                <td>{e.niveau}</td>
                <td>
                  <span className="dossier-badge" style={{
                    background: e.statut==='payé' ? '#e6f7f5' : '#fef2f2',
                    color: e.statut==='payé' ? '#0d9488' : '#ef4444'
                  }}>
                    {e.statut === 'payé' ? '✅ Payé' : '⏳ Non payé'}
                  </span>
                </td>
                <td>
                  <button className="dossier-btn" 
                    onClick={() => onUpdate(e.id, e.statut === 'payé' ? 'non payé' : 'payé')}
                    style={{background: e.statut==='payé' ? '#fef2f2' : '#22c55e', color: e.statut==='payé' ? '#ef4444' : '#fff'}}>
                    {e.statut === 'payé' ? 'Annuler' : 'Valider'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

// ── PAGE PRINCIPALE ──────────────────────────────────────────
export default function Secretaire() {
  const [page, setPage] = useState('dashboard')
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEleves = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`)
      setEleves(res.data)
      setLoading(false)
    } catch (err) { setLoading(false) }
  }

  useEffect(() => { fetchEleves() }, [])

  const handleUpdateStatut = async (id, newStatut) => {
    try {
      await axios.put(`${API_URL}/students/${id}`, { statut: newStatut })
      fetchEleves()
    } catch (err) { alert("Erreur de mise à jour") }
  }

  if (loading) return <div className="main-content">Chargement...</div>

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      {page==='dashboard'    && <Dashboard eleves={eleves} />}
      {page==='inscriptions' && <Inscriptions onRefresh={fetchEleves} />}
      {page==='payment'      && <Payment eleves={eleves} onUpdate={handleUpdateStatut} />}
      {page==='formulaire'   && (
        <main className="main-content">
          <h1 className="page-title">Formulaire</h1>
          <div className="pdf-box" style={{display:'flex', justifyContent:'space-between', padding:'20px', background:'#fff', borderRadius:'12px'}}>
             <span>📄 formulaire_inscription.pdf</span>
             <button className="btn-download">⬇ Télécharger</button>
          </div>
        </main>
      )}
    </div>
  )
}