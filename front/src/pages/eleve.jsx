// ============================================================
// Eleve.jsx — Interface complète liée au Backend (Node.js)
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // npm install axios
import './Eleve.css';

export default function Eleve() {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // ── ÉTATS DES DONNÉES (Provenant du Backend) ────────────────
  const [eleve, setEleve] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [notes, setNotes] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [devoirs, setDevoirs] = useState([]);

  // ── ÉTATS UI ───────────────────────────────────────────────
  const [filtreCours, setFiltreCours] = useState('Tous');
  const [modalMois, setModalMois] = useState(null);
  const [methode, setMethode] = useState('Espèces');

  // 1. CHARGEMENT DES DONNÉES DEPUIS L'API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // On récupère l'ID de l'élève (ex: stocké dans localStorage lors du login)
        const studentId = localStorage.getItem('studentId') || 1; 
        
        // Appel API (Assurez-vous que votre serveur Node.js tourne sur le port 5000)
        const res = await axios.get(`http://localhost:5000/api/eleve/data/${studentId}`);
        
        setEleve(res.data.profile);
        setPaiements(res.data.payments);
        setNotes(res.data.grades);
        setAbsences(res.data.absences);
        setDevoirs(res.data.homeworks);
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // 2. FONCTION DE PAIEMENT (UPDATE DB)
  async function marquerPaye(id) {
    try {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD pour MySQL
      
      await axios.put(`http://localhost:5000/api/payments/pay/${id}`, {
        methode: methode,
        date: today
      });

      // Mise à jour locale pour l'affichage immédiat
      setPaiements(prev => prev.map(p => 
        p.id === id ? { ...p, statut: 'payé', date: today, methode: methode } : p
      ));
      
      setModalMois(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour du paiement");
    }
  }

  if (loading) return <div className="loading">Chargement des données...</div>;
  if (!eleve) return <div className="error">Élève non trouvé.</div>;

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'notes',     icon: '📝', label: 'Mes Notes'      },
    { id: 'cours',     icon: '📚', label: 'Mes Cours'      },
    { id: 'absences',  icon: '📋', label: 'Absences'       },
    { id: 'paiement',  icon: '💳', label: 'Paiement'       },
  ];

  return (
    <div className="eleve-layout">
      <aside className="sidebar">
        <img src="/logo.png" width="150" alt="logo" />
        <nav style={{ flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: 'linear-gradient(135deg,#4f8ef7,#6366f1)' }}>
            {eleve.initials}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{eleve.nom}</div>
            <div className="role">{eleve.classe} · Élève</div>
          </div>
          <span className="sidebar-arrow" onClick={() => navigate('/login')}>←</span>
        </div>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <PageDashboard devoirs={devoirs} paiements={paiements} eleve={eleve} notes={notes} />}
        {page === 'notes'     && <PageNotes notes={notes} />}
        {page === 'paiement'  && (
          <PagePaiement 
            paiements={paiements} 
            modalMois={modalMois} 
            setModalMois={setModalMois} 
            methode={methode} 
            setMethode={setMethode} 
            marquerPaye={marquerPaye} 
          />
        )}
      </main>
    </div>
  );
}

// ── PAGE PAIEMENT (DYNAMIQUE) ────────────────────────────────
function PagePaiement({ paiements, modalMois, setModalMois, methode, setMethode, marquerPaye }) {
  const paye = paiements.filter(p => p.statut === 'payé');
  const nonPaye = paiements.filter(p => p.statut !== 'payé');
  const totalPaye = paye.reduce((s, p) => s + p.montant, 0);

  return (
    <>
      <h1 className="page-title">💳 Paiement</h1>
      
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 22 }}>
        <div className="stat-card green">
          <div className="stat-number">{paye.length}</div>
          <div className="stat-label">Mois payés</div>
          <div className="stat-sub">{totalPaye.toLocaleString()} DA</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{nonPaye.length}</div>
          <div className="stat-label">Mois restants</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-number">{Math.round((paye.length / paiements.length) * 100)}%</div>
          <div className="stat-label">Progression</div>
        </div>
      </div>

      <div className="notes-card">
        <table className="notes-table">
          <thead>
            <tr>
              <th>MOIS</th>
              <th>MONTANT</th>
              <th>STATUT</th>
              <th>DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map(p => (
              <tr key={p.id}>
                <td><strong>{p.mois}</strong></td>
                <td>{p.montant} DA</td>
                <td>
                  <span className={`promo-badge ${p.statut === 'payé' ? 'promo-up' : 'promo-down'}`}>
                    {p.statut === 'payé' ? '✅ Payé' : '❌ Non payé'}
                  </span>
                </td>
                <td>{p.date || '—'}</td>
                <td>
                  {p.statut !== 'payé' && (
                    <button className="pay-btn" onClick={() => setModalMois(p)}>Régler →</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalMois && (
        <div className="modal-overlay" onClick={() => setModalMois(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Paiement — {modalMois.mois}</h2>
            <p>Montant à régler : <strong>{modalMois.montant} DA</strong></p>
            <div className="method-grid">
              {['Espèces', 'Virement', 'CCP'].map(m => (
                <button key={m} 
                        className={methode === m ? 'active' : ''} 
                        onClick={() => setMethode(m)}>{m}</button>
              ))}
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalMois(null)}>Annuler</button>
              <button className="confirm-btn" onClick={() => marquerPaye(modalMois.id)}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── PAGE DASHBOARD (DYNAMIQUE) ────────────────────────────────
function PageDashboard({ devoirs, paiements, eleve, notes }) {
  const nbImpaye = paiements.filter(p => p.statut !== 'payé').length;
  
  return (
    <>
      <h1 className="page-title">Tableau de bord</h1>
      <div className="eleve-profile-card">
        <div className="eleve-profile-avatar"><span>{eleve.initials}</span></div>
        <div className="eleve-profile-info">
          <h2 className="eleve-profile-name">{eleve.nom}</h2>
          <p className="eleve-profile-sub">Année {eleve.annee} · N° {eleve.numero}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <span className="promo-badge promo-up">✅ {eleve.statut}</span>
            {nbImpaye > 0 && <span className="promo-badge promo-down">💳 {nbImpaye} mois impayés</span>}
          </div>
        </div>
      </div>
      {/* ... reste des stats du dashboard ... */}
    </>
  );
}

// ── PAGE NOTES ──────────────────────────────────────────────
function PageNotes({ notes }) {
    return (
      <>
        <h1 className="page-title">Mes Notes</h1>
        <div className="notes-card">
          <table className="notes-table">
            <thead>
                <tr>
                    <th>MATIÈRE</th>
                    <th>MOYENNE</th>
                    <th>NIVEAU</th>
                </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => (
                <tr key={i}>
                  <td>{n.matiere}</td>
                  <td><span className="stat-number-sm">{n.moyenne}</span></td>
                  <td>{n.niveau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
}