import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ELEVES_INIT, CLASSES, EDT_INIT, ELEVES_PAR_CLASSE, ABSENCES_INIT,
  calcMoyenne, moyenneClass, calcPromotion, getMatiereStyle, todayStr
} from '../data/shared'

const LOGO = (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <rect width="56" height="56" rx="14" fill="#4f8ef7"/>
    <text x="28" y="38" textAnchor="middle" fontSize="28" fill="white" fontFamily="Arial">🎓</text>
  </svg>
)

const COURS_DATA = [
  { seq: 'Séq. 1', projet: 'Texte informatif',    matiere: 'Français', type: 'Compréhension',     statut: 'Terminé',  duree: '2h', groupe: 'Groupe A1', color: '#4f8ef7', bg: '#EFF6FF', date: '15/03/2026' },
  { seq: 'Séq. 1', projet: 'Champ lexical',        matiere: 'Français', type: 'Vocabulaire',       statut: 'Terminé',  duree: '1h', groupe: 'Groupe A2', color: '#4f8ef7', bg: '#EFF6FF', date: '17/03/2026' },
  { seq: 'Séq. 2', projet: 'Texte argumentatif',   matiere: 'Français', type: 'Grammaire',         statut: 'En cours', duree: '2h', groupe: 'Groupe B1', color: '#4f8ef7', bg: '#EFF6FF', date: '18/03/2026' },
  { seq: 'Séq. 2', projet: 'Rédaction persuasive', matiere: 'Français', type: 'Expression écrite', statut: 'À faire',  duree: '2h', groupe: 'Groupe B2', color: '#4f8ef7', bg: '#EFF6FF', date: '20/03/2026' },
  { seq: 'Séq. 3', projet: 'Expression orale',     matiere: 'Français', type: 'Expression orale',  statut: 'À faire',  duree: '2h', groupe: 'Groupe C1', color: '#4f8ef7', bg: '#EFF6FF', date: '22/03/2026' },
  { seq: 'Séq. 3', projet: 'Dictée & Orthographe', matiere: 'Français', type: 'Orthographe',       statut: 'À faire',  duree: '1h', groupe: 'Groupe C2', color: '#4f8ef7', bg: '#EFF6FF', date: '24/03/2026' },
  { seq: 'Séq. 1', projet: 'Vocabulary & Grammar',  matiere: 'Anglais', type: 'Compréhension',     statut: 'Terminé',  duree: '2h', groupe: 'Groupe A1', color: '#22c55e', bg: '#F0FDF4', date: '15/03/2026' },
  { seq: 'Séq. 1', projet: 'Reading Comprehension', matiere: 'Anglais', type: 'Lecture',            statut: 'Terminé',  duree: '1h', groupe: 'Groupe A2', color: '#22c55e', bg: '#F0FDF4', date: '17/03/2026' },
  { seq: 'Séq. 2', projet: 'Oral Presentation',     matiere: 'Anglais', type: 'Expression orale',  statut: 'En cours', duree: '1h', groupe: 'Groupe B1', color: '#22c55e', bg: '#F0FDF4', date: '18/03/2026' },
  { seq: 'Séq. 2', projet: 'Essay Writing',         matiere: 'Anglais', type: 'Expression écrite', statut: 'À faire',  duree: '2h', groupe: 'Groupe B2', color: '#22c55e', bg: '#F0FDF4', date: '20/03/2026' },
  { seq: 'Séq. 3', projet: 'Listening Skills',      matiere: 'Anglais', type: 'Compréhension',     statut: 'À faire',  duree: '2h', groupe: 'Groupe C1', color: '#22c55e', bg: '#F0FDF4', date: '22/03/2026' },
  { seq: 'Séq. 3', projet: 'Advanced Writing',      matiere: 'Anglais', type: 'Expression écrite', statut: 'À faire',  duree: '2h', groupe: 'Groupe C2', color: '#22c55e', bg: '#F0FDF4', date: '24/03/2026' },
]

const STATUT_BADGE = {
  'Terminé':  { cls: 'promo-up',   label: '✓ Terminé'  },
  'En cours': { cls: 'promo-same', label: '⏳ En cours' },
  'À faire':  { cls: 'promo-down', label: '○ À faire'   },
}

const BackBtn = ({ setPage }) => (
  <button onClick={() => setPage('dashboard')} style={{
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#4f8ef7', fontWeight: 700, fontSize: 18,
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 16, padding: 0
  }}>← Retour</button>
)

// ── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate()
  const items = [
    { key:'dashboard', label:'Tableau de bord', icon:'📊' },
    { key:'notes',     label:'Saisie des notes', icon:'📝' },
    { key:'cours',     label:'Mes Cours',        icon:'📚' },
    { key:'absence',   label:'Absences',         icon:'⚠️' },
    { key:'edt',       label:'Mon EDT',           icon:'📅' },
  ]
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-block">
        <div className="sidebar-logo-img">{LOGO}</div>
        <div className="sidebar-logo-text">أكاديمية سبل النجاح</div>
      </div>
      <span className="sidebar-section-label">Mon Espace</span>
      {items.map(item => (
        <button key={item.key}
          className={`nav-item ${activePage===item.key?'active':''}`}
          onClick={() => onNavigate(item.key)}>
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sidebar-user">
        <div className="sidebar-avatar">AH</div>
        <div className="sidebar-user-info">
          <div className="name">Ahlam Mansouri</div>
          <div className="role">Enseignante</div>
        </div>
        <span className="sidebar-arrow" onClick={() => navigate('/login')}>←</span>
      </div>
    </aside>
  )
}

// ── MODALS ────────────────────────────────────────────────────
function ModalAjouter({ onClose, onAjouter }) {
  const [nom, setNom]       = useState('')
  const [niveau, setNiveau] = useState('A1')
  const [test1, setTest1]   = useState('')
  const [test2, setTest2]   = useState('')
  const [test3, setTest3]   = useState('')
  const couleurs = ['#7c6f9f','#8b6f6f','#6f8b6f','#8b7f5f','#5f7f8b','#8b5f7f']

  function handleSubmit() {
    if (!nom.trim()) return
    const parts = nom.trim().split(' ')
    const initiales = parts.length >= 2
      ? (parts[0][0]+parts[1][0]).toUpperCase()
      : nom.slice(0,2).toUpperCase()
    onAjouter({
      id: Date.now(), nom: nom.trim(), initiales,
      couleur: couleurs[Math.floor(Math.random()*couleurs.length)],
      test1: test1!==''?Number(test1):null,
      test2: test2!==''?Number(test2):null,
      test3: test3!==''?Number(test3):null,
      niveau, classe:'Groupe A1',
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <h2>Ajouter un élève</h2>
        <label className="modal-label">Nom complet</label>
        <input className="modal-input" placeholder="Ex: Amina Bouzid" value={nom} onChange={e=>setNom(e.target.value)} />
        <label className="modal-label">Niveau actuel</label>
        <select className="modal-select" value={niveau} onChange={e=>setNiveau(e.target.value)}>
          {['A1','A2','B1','B2','C1','C2'].map(n=><option key={n}>{n}</option>)}
        </select>
        <label className="modal-label">Notes</label>
        <div className="modal-tests-row">
          {[['Test 1',test1,setTest1],['Test 2',test2,setTest2],['Test 3',test3,setTest3]].map(([lbl,val,set])=>(
            <div className="test-field" key={lbl}>
              <label>{lbl} /20</label>
              <input type="number" min="0" max="20" placeholder="—" value={val} onChange={e=>set(e.target.value)} />
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-confirm" onClick={handleSubmit}>Ajouter l'élève</button>
        </div>
      </div>
    </div>
  )
}

function ModalGeneric({ title, fields, initialData, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(initialData || {})
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <h2>{title}</h2>
        {fields.map(f=>(
          <div key={f.key}>
            <label className="modal-label">{f.label}</label>
            {f.type==='select'
              ? <select className="modal-select" value={form[f.key]||''} onChange={e=>set(f.key,e.target.value)}>
                  {f.options.map(o=><option key={o}>{o}</option>)}
                </select>
              : <input className="modal-input" type={f.type||'text'} placeholder={f.placeholder||''}
                  value={form[f.key]||''} onChange={e=>set(f.key,e.target.value)} />
            }
          </div>
        ))}
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          {onDelete && <button className="btn-danger" onClick={onDelete}>Supprimer</button>}
          <button className="btn-confirm" onClick={()=>onSave(form)}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ eleves, onNavigate }) {
  const elevesAvecMoy = eleves.map(e=>({...e, moyenne:calcMoyenne(e.test1,e.test2,e.test3)}))
  return (
    <main className="main-content">
      <h1 className="page-title">Tableau de bord</h1>
      <div className="stats-grid">
        <div className="stat-card blue">
          <span className="stat-icon">🎒</span>
          <div className="stat-number">{eleves.length}</div>
          <div className="stat-label">Mes élèves</div>
          <div className="stat-sub">Tous groupes</div>
        </div>
        <div className="stat-card orange">
          <span className="stat-icon">📄</span>
          <div className="stat-number">3</div>
          <div className="stat-label">Évals ce mois</div>
          <div className="stat-sub">2 à corriger</div>
        </div>
        <div className="stat-card red">
          <span className="stat-icon">⚠️</span>
          <div className="stat-number">7</div>
          <div className="stat-label">Absences signalées</div>
          <div className="stat-sub">Cette semaine</div>
        </div>
      </div>
      <div className="bottom-grid">
        <div className="section-card">
          <h3>Mes cours aujourd'hui</h3>
          {[
            ['08:00 – 09:30','Français','Groupe A1 • Salle 2'],
            ['10:00 – 11:30','Anglais', 'Groupe C1 • Salle 3'],
          
          ].map(([time,subj,det])=>(
            <div className="course-item" key={time}>
              <span className="course-time">{time}</span>
              <div className="course-info">
                <div className="subject">{subj}</div>
                <div className="details">{det}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-card">
          <h3>Dernières notes saisies</h3>
          <table className="notes-table-mini">
            <thead><tr><th>Élève</th><th>Niveau</th><th>Moyenne</th></tr></thead>
            <tbody>
              {elevesAvecMoy.slice(0,5).map(e=>(
                <tr key={e.id}>
                  <td>
                    <div className="eleve-cell">
                      <span className="eleve-avatar" style={{background:e.couleur}}>{e.initiales}</span>
                      {e.nom.split(' ')[0]}
                    </div>
                  </td>
                  <td>{e.niveau}</td>
                  <td>{e.moyenne!==null
                    ? <span className={moyenneClass(e.moyenne)}>{e.moyenne.toFixed(2)}/20</span>
                    : <span className="text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

// ── NOTES ─────────────────────────────────────────────────────
function Notes({ eleves, setEleves }) {
  const [search, setSearch]       = useState('')
  const [classe, setClasse]       = useState('Toutes')
  const [showModal, setShowModal] = useState(false)

  const elevesFiltres = eleves.filter(e => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase())
    const matchClasse = classe==='Toutes' || e.classe===classe
    return matchSearch && matchClasse
  })

  const updateNote   = (id,field,val) => setEleves(p=>p.map(e=>e.id===id?{...e,[field]:val===''?null:Number(val)}:e))
  const updateNiveau = (id,val)       => setEleves(p=>p.map(e=>e.id===id?{...e,niveau:val}:e))
  const deleteEleve  = (id)           => setEleves(p=>p.filter(e=>e.id!==id))
  const ajouterEleve = (n)            => setEleves(p=>[...p,n])

  return (
    <main className="main-content">
      <h1 className="page-title">Saisie des notes</h1>
      <div className="notes-header">
        <select className="filter-select" value={classe} onChange={e=>setClasse(e.target.value)}>
          <option value="Toutes">Toutes les classes</option>
          {CLASSES.map(c=><option key={c}>{c}</option>)}
        </select>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input placeholder="Rechercher un élève..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <button className="btn-add" onClick={()=>setShowModal(true)}>+ Ajouter un élève</button>
      </div>
      <div className="notes-card">
        <div className="notes-card-header">
          <h3>Liste des élèves</h3>
          <span className="count-badge">{elevesFiltres.length} élèves</span>
        </div>
        <table className="notes-table">
          <thead>
            <tr><th>Élève</th><th>Test 1</th><th>Test 2</th><th>Test 3</th><th>Moyenne</th><th>Niveau</th><th>Promotion</th><th></th></tr>
          </thead>
          <tbody>
            {elevesFiltres.map(e => {
              const moy   = calcMoyenne(e.test1,e.test2,e.test3)
              const promo = calcPromotion(e.niveau,moy)
              return (
                <tr key={e.id}>
                  <td>
                    <div className="eleve-cell">
                      <span className="eleve-avatar" style={{background:e.couleur}}>{e.initiales}</span>
                      {e.nom}
                    </div>
                  </td>
                  {['test1','test2','test3'].map(t=>(
                    <td key={t}>
                      <input className="note-input" type="number" min="0" max="20" placeholder="—"
                        value={e[t]??''} onChange={ev=>updateNote(e.id,t,ev.target.value)} />
                    </td>
                  ))}
                  <td>{moy!==null
                    ? <span className={moyenneClass(moy)}>{moy.toFixed(2)}/20</span>
                    : <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <select className="niveau-select" value={e.niveau} onChange={ev=>updateNiveau(e.id,ev.target.value)}>
                      {['A1','A2','B1','B2','C1','C2'].map(n=><option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td><span className={`promo-badge ${promo.cls}`}>{promo.text}</span></td>
                  <td><button className="btn-delete" onClick={()=>deleteEleve(e.id)}>✕</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {showModal && <ModalAjouter onClose={()=>setShowModal(false)} onAjouter={ajouterEleve} />}
    </main>
  )
}

// ── COURS ─────────────────────────────────────────────────────
function PageCours({ setPage }) {
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('Tous')
  const [filtreGroupe, setFiltreGroupe] = useState('Tous')

  const matieres = ['Tous', 'Français', 'Anglais']
  const groupes  = ['Tous', 'Groupe A1', 'Groupe A2', 'Groupe B1', 'Groupe B2', 'Groupe C1', 'Groupe C2']

  const filtered = COURS_DATA.filter(c => {
    const matchSearch  = c.projet.toLowerCase().includes(search.toLowerCase())
    const matchFiltre  = filtre === 'Tous' || c.matiere === filtre
    const matchGroupe  = filtreGroupe === 'Tous' || c.groupe === filtreGroupe
    return matchSearch && matchFiltre && matchGroupe
  })

  return (
    <main className="main-content">
      <div className="cours-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Cours & Ressources</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{filtered.length} ressources</p>
        </div>
        <button className="btn-add">+ Ajouter ressource</button>
      </div>

      <div className="cours-filters">
        <div className="cours-search">
          <span>🔍</span>
          <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {matieres.map(m => (
          <button key={m} className={`filter-pill ${filtre === m ? 'active' : ''}`} onClick={() => setFiltre(m)}>
            {m}
          </button>
        ))}
      </div>

      <div className="cours-filters" style={{ marginTop: 8 }}>
        {groupes.map(g => (
          <button key={g} className={`filter-pill ${filtreGroupe === g ? 'active' : ''}`} onClick={() => setFiltreGroupe(g)}>
            {g}
          </button>
        ))}
      </div>

      <div className="notes-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="cours-table">
            <thead>
              <tr>
                <th>TITRE</th>
                <th>MATIÈRE</th>
                <th>CLASSE</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="matiere-icon" style={{ background: c.bg, color: c.color, fontSize: 12, fontWeight: 700 }}>
                        {c.matiere === 'Français' ? 'FR' : 'AN'}
                      </div>
                      <span style={{ fontWeight: 500 }}>{c.projet}</span>
                    </div>
                  </td>
                  <td>
                    <span className="matiere-badge" style={{ background: c.color + '18', color: c.color }}>
                      {c.matiere}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{c.groupe}</td>
                  <td style={{ fontSize: 13, color: '#94a3b8' }}>{c.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>✏️</button>
                      <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>🗑️</button>
                      <button style={{ background: '#4f8ef7', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>⬇</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

// ── EDT ───────────────────────────────────────────────────────
function EDT() {
  const JOURS    = ['Mardi','Jeudi','Vendredi','Samedi']
  const CRENEAUX = ['08:00–09:30','10:00–11:30','12:00–13:30','14:00–15:30','16:00–17:30']

  function buildFrancaisEDT() {
    const result = {}
    Object.entries(EDT_INIT).forEach(([groupe,jours])=>{
      Object.entries(jours).forEach(([jour,creneaux])=>{
        Object.entries(creneaux).forEach(([creneau,cell])=>{
          if (cell.matiere==='Français') {
            if (!result[groupe]) result[groupe]={}
            if (!result[groupe][jour]) result[groupe][jour]={}
            result[groupe][jour][creneau]=cell
          }
        })
      })
    })
    return result
  }

  const EDT_FRANCAIS     = buildFrancaisEDT()
  const GROUPES_FRANCAIS = CLASSES.filter(c=>EDT_FRANCAIS[c]&&Object.keys(EDT_FRANCAIS[c]).length>0)

  const [classe, setClasse] = useState(GROUPES_FRANCAIS[0]||'Groupe A1')
  const [edt, setEdt]       = useState(EDT_FRANCAIS)
  const [modal, setModal]   = useState(null)

  const getCell = (jour,cr) => edt[classe]?.[jour]?.[cr]||null
  const ms = getMatiereStyle('Français')

  function saveCell(form) {
    setEdt(prev=>{
      const next = JSON.parse(JSON.stringify(prev))
      if (!next[classe])             next[classe]={}
      if (!next[classe][modal.jour]) next[classe][modal.jour]={}
      if (form===null) delete next[classe][modal.jour][modal.creneau]
      else next[classe][modal.jour][modal.creneau]={...form,matiere:'Français'}
      return next
    })
    setModal(null)
  }

  return (
    <main className="main-content">
      <div className="edt-header">
        <div>
          <h1 className="page-title" style={{marginBottom:4}}>Emploi du temps — Français</h1>
          <p className="text-muted" style={{fontSize:13}}>Classe — <strong>{classe}</strong></p>
        </div>
        <div className="edt-controls">
          <select className="edt-select" value={classe} onChange={e=>setClasse(e.target.value)}>
            {GROUPES_FRANCAIS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button className="btn-print" onClick={()=>window.print()}>🖨️ Imprimer</button>
        </div>
      </div>
      <div className="notes-card" style={{overflow:'auto'}}>
        <table className="edt-table">
          <thead>
            <tr><th></th>{JOURS.map(j=><th key={j}>{j}</th>)}</tr>
          </thead>
          <tbody>
            {CRENEAUX.map(cr=>(
              <tr key={cr}>
                <td>{cr}</td>
                {JOURS.map(j=>{
                  const entry=getCell(j,cr)
                  return (
                    <td key={j}>
                      <div className={`edt-cell ${entry?'':'empty'}`}
                        style={entry?{background:ms.bg,border:`1.5px solid ${ms.border}`}:{}}
                        onClick={()=>setModal({jour:j,creneau:cr,existing:entry})}>
                        {entry ? (
                          <>
                            <span className="edt-cell-matiere" style={{color:ms.color}}>Français</span>
                            <span className="edt-cell-prof"    style={{color:ms.color}}>{entry.prof}</span>
                            <span className="edt-cell-salle"   style={{color:ms.color}}>{entry.salle}</span>
                          </>
                        ) : <span className="edt-cell-plus">+</span>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <ModalGeneric
          title={`Français · ${modal.jour} · ${modal.creneau}`}
          fields={[{key:'prof',label:'Professeur',type:'text'},{key:'salle',label:'Salle',type:'text'}]}
          initialData={modal.existing||{prof:'B. Hamidi',salle:'Salle 02'}}
          onClose={()=>setModal(null)} onSave={saveCell}
          onDelete={modal.existing?()=>saveCell(null):null}
        />
      )}
    </main>
  )
}

// ── ABSENCES ──────────────────────────────────────────────────
function Absences() {
  const [classe, setClasse]         = useState('Groupe A1')
  const [presences, setPresences]   = useState({})
  const [filterJustif, setFilter]   = useState('Tous')
  const [savedMsg, setSavedMsg]     = useState(false)
  const [historique, setHistorique] = useState(ABSENCES_INIT)

  const eleves = ELEVES_PAR_CLASSE[classe]??[]
  const setPresence = (id,val) => setPresences(p=>({...p,[id]:p[id]===val?null:val}))

  function enregistrer() {
    const absents    = eleves.filter(e=>presences[e.id]==='absent')
    const newEntries = absents.map((e,i)=>({id:Date.now()+i, eleve:e.nom, date:todayStr(), justifiee:'En attente'}))
    setHistorique(prev=>[...prev,...newEntries])
    setPresences({})
    setSavedMsg(true)
    setTimeout(()=>setSavedMsg(false), 2500)
  }

  function toggleJustif(id) {
    const cycle = {'En attente':'Oui','Oui':'Non','Non':'En attente'}
    setHistorique(prev=>prev.map(h=>h.id===id?{...h,justifiee:cycle[h.justifiee]||'En attente'}:h))
  }

  const JUSTIF_STYLE = {
    'Oui':        {bg:'#D1FAE5',color:'#065F46'},
    'Non':        {bg:'#FEE2E2',color:'#991B1B'},
    'En attente': {bg:'#FEF3C7',color:'#92400E'},
  }

  const filteredHist = historique.filter(h=>filterJustif==='Tous'||h.justifiee===filterJustif)

  return (
    <main className="main-content">
      <h1 className="page-title">Gestion des absences</h1>
      <div className="absences-grid">
        <div className="absence-panel">
          <div className="absence-panel-title">Saisie des absences</div>
          <div className="absence-panel-sub">Séance Français du {todayStr()}</div>
          <div style={{marginBottom:14}}>
            <label className="modal-label">Classe</label>
            <select className="modal-select" value={classe} onChange={e=>{setClasse(e.target.value);setPresences({})}}>
              {CLASSES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="presence-header">
            <span className="presence-col-label" style={{textAlign:'left'}}>Élève</span>
            <span className="presence-col-label">Présent</span>
            <span className="presence-col-label">Absent</span>
          </div>
          {eleves.length===0
            ? <div style={{textAlign:'center',padding:'24px 0',color:'#94a3b8',fontSize:14}}>Aucun élève dans ce groupe</div>
            : eleves.map((e,i)=>{
              const etat=presences[e.id]
              return (
                <div className="presence-row" key={e.id} style={i===eleves.length-1?{borderBottom:'none'}:{}}>
                  <div className="eleve-cell">
                    <div style={{width:34,height:34,borderRadius:'50%',background:e.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{e.initiales}</div>
                    <span style={{fontSize:14,color:'#1e293b',fontWeight:500}}>{e.nom}</span>
                  </div>
                  <div className="presence-dot" style={{background:etat==='present'?'#2C3E6B':'#e2e8f0',borderColor:etat==='present'?'#2C3E6B':'#cbd5e1'}} onClick={()=>setPresence(e.id,'present')} />
                  <div className="presence-dot" style={{background:etat==='absent'?'#EF4444':'#e2e8f0',borderColor:etat==='absent'?'#EF4444':'#cbd5e1'}} onClick={()=>setPresence(e.id,'absent')} />
                </div>
              )
            })
          }
          {savedMsg && <div className="toast-success">✅ Absences enregistrées !</div>}
          <button onClick={enregistrer} style={{marginTop:18,width:'100%',padding:'12px 0',background:'#2C3E6B',color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:15}}>
            Enregistrer
          </button>
        </div>

        <div className="absence-panel">
          <div className="flex-between" style={{marginBottom:16}}>
            <div className="absence-panel-title">Historique des absences</div>
            <select value={filterJustif} onChange={e=>setFilter(e.target.value)} style={{padding:'5px 10px',borderRadius:8,border:'1.5px solid #e2e8f0',fontSize:12}}>
              {['Tous','Oui','Non','En attente'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 80px 90px 24px',gap:6,padding:'6px 0',borderBottom:'1px solid #f1f5f9',marginBottom:4}}>
            {['Élève','Date','Justifiée',''].map(h=>(
              <span key={h} style={{fontSize:10,fontWeight:700,color:'#94a3b8',letterSpacing:'.05em',textTransform:'uppercase'}}>{h}</span>
            ))}
          </div>
          {filteredHist.length===0
            ? <div style={{textAlign:'center',padding:'36px 0',color:'#94a3b8',fontSize:14}}>Aucune absence enregistrée</div>
            : filteredHist.map((h,i)=>{
              const js=JUSTIF_STYLE[h.justifiee]||JUSTIF_STYLE['En attente']
              return (
                <div key={h.id} style={{display:'grid',gridTemplateColumns:'1fr 80px 90px 24px',gap:6,alignItems:'center',padding:'10px 0',borderBottom:i<filteredHist.length-1?'1px solid #f8fafc':'none'}}>
                  <span style={{fontSize:13,fontWeight:600,color:'#1e293b'}}>{h.eleve}</span>
                  <span style={{fontSize:12,color:'#94a3b8'}}>{h.date}</span>
                  <span className="justif-badge" style={{background:js.bg,color:js.color}} onClick={()=>toggleJustif(h.id)} title="Cliquer pour changer">{h.justifiee}</span>
                  <button onClick={()=>setHistorique(p=>p.filter(x=>x.id!==h.id))} style={{background:'none',border:'none',cursor:'pointer',color:'#cbd5e1',fontSize:13}}>✕</button>
                </div>
              )
            })
          }
          <div className="absence-summary">
            {[
              {label:'Total',      val:historique.length,                                        color:'#2C3E6B'},
              {label:'Justifiées', val:historique.filter(h=>h.justifiee==='Oui').length,        color:'#10B981'},
              {label:'Non just.',  val:historique.filter(h=>h.justifiee==='Non').length,        color:'#EF4444'},
              {label:'Attente',    val:historique.filter(h=>h.justifiee==='En attente').length, color:'#F59E0B'},
            ].map(({label,val,color})=>(
              <div className="summary-stat" key={label}>
                <div className="summary-num" style={{color}}>{val}</div>
                <div className="summary-lbl">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ── PAGE PRINCIPALE ENSEIGNANT ────────────────────────────────
export default function Enseignant() {
  const [page, setPage]     = useState('dashboard')
  const [eleves, setEleves] = useState(ELEVES_INIT)

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      {page==='dashboard' && <Dashboard eleves={eleves} onNavigate={setPage} />}
      {page==='notes'     && <Notes     eleves={eleves} setEleves={setEleves} />}
      {page==='cours'     && <PageCours setPage={setPage} />}
      {page==='edt'       && <EDT />}
      {page==='absence'   && <Absences />}
    </div>
  )
}