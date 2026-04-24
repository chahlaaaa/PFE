import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  authActions, 
  etudiantsAPI, 
  enseignantsAPI, 
  formationsAPI 
} from '../api';

// ── Configuration des Couleurs ─────────────────────────────────────────────
const ACCENT = "#6c63ff";
const GREEN = "#22c55e";
const RED = "#ef4444";
const ORANGE = "#f97316";

export default function Directeur() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("dashboard");
    
    // ── États des Données (Real Data) ──
    const [employes, setEmployes] = useState([]);
    const [formations, setFormations] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Chargement des données depuis le serveur ──
    useEffect(() => {
        const loadAppData = async () => {
            setLoading(true);
            try {
                const [resEmp, resForm, resEtud] = await Promise.all([
                    enseignantsAPI.getAll(),
                    formationsAPI.getAll(),
                    etudiantsAPI.getAll()
                ]);
                setEmployes(resEmp || []);
                setFormations(resForm || []);
                setEtudiants(resEtud || []);
            } catch (err) {
                console.error("Erreur de chargement:", err);
                alert("Erreur de connexion avec le serveur MySQL");
            } finally {
                setLoading(false);
            }
        };
        loadAppData();
    }, []);

    const handleLogout = () => {
        authActions.clearAll();
        navigate('/');
    };

    if (loading) return <div style={styles.loading}>Chargement du panneau d'administration...</div>;

    return (
        <div style={styles.container}>
            {/* Barre Latérale (Sidebar) */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>Ways of Success 🎓</div>
                <nav style={styles.nav}>
                    <button onClick={() => setTab("dashboard")} style={tab === "dashboard" ? styles.navBtnActive : styles.navBtn}>📊 Tableau de bord</button>
                    <button onClick={() => setTab("employes")} style={tab === "employes" ? styles.navBtnActive : styles.navBtn}>👥 Employés</button>
                    <button onClick={() => setTab("formations")} style={tab === "formations" ? styles.navBtnActive : styles.navBtn}>📚 Formations</button>
                    <button onClick={() => setTab("finance")} style={tab === "finance" ? styles.navBtnActive : styles.navBtn}>💰 Finance & Paie</button>
                </nav>
                <button onClick={handleLogout} style={styles.logoutBtn}>Se déconnecter</button>
            </div>

            {/* Contenu Principal */}
            <div style={styles.content}>
                {tab === "dashboard" && <DashboardView employes={employes} formations={formations} etudiants={etudiants} />}
                {tab === "employes" && <EmployesView employes={employes} />}
                {tab === "formations" && <FormationsView formations={formations} />}
                {tab === "finance" && <FinanceView etudiants={etudiants} employes={employes} />}
            </div>
        </div>
    );
}

// ── Vue: Tableau de Bord ──────────────────────────────────────────────────
function DashboardView({ employes, formations, etudiants }) {
    const revenusEncaisses = etudiants.filter(e => e.paye).reduce((a, b) => a + (b.montant || 0), 0);
    
    return (
        <div>
            <h2 style={styles.header}>Tableau de Bord</h2>
            <div style={styles.statsGrid}>
                <StatCard title="Étudiants" value={etudiants.length} color={ORANGE} icon="🎓" />
                <StatCard title="Employés" value={employes.length} color={ACCENT} icon="👥" />
                <StatCard title="Formations" value={formations.length} color={GREEN} icon="📚" />
                <StatCard title="Revenus (DA)" value={revenusEncaisses.toLocaleString()} color={GREEN} icon="💰" />
            </div>
        </div>
    );
}

// ── Vue: Liste des Employés ───────────────────────────────────────────────
function EmployesView({ employes }) {
    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{margin:0}}>Gestion du Personnel</h3>
                <button style={styles.actionBtn}>+ Nouvel Employé</button>
            </div>
            <table style={styles.table}>
                <thead style={styles.thead}>
                    <tr>
                        <th style={styles.th}>Nom & Prénom</th>
                        <th style={styles.th}>Poste / Rôle</th>
                        <th style={styles.th}>Contact</th>
                        <th style={styles.th}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {employes.map(emp => (
                        <tr key={emp.id} style={styles.tr}>
                            <td style={styles.td}>{emp.nom || emp.username}</td>
                            <td style={styles.td}><span style={styles.roleBadge}>{emp.role}</span></td>
                            <td style={styles.td}>{emp.contact || 'N/A'}</td>
                            <td style={styles.td}><span style={{ color: GREEN, fontWeight: 'bold' }}>● Actif</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Vue: Formations ───────────────────────────────────────────────────────
function FormationsView({ formations }) {
    return (
        <div style={styles.card}>
            <h3>Catalogue des Formations</h3>
            <div style={styles.gridFormations}>
                {formations.map(f => (
                    <div key={f.id} style={styles.formationItem}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>📖</div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>{f.nom}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>Langue: {f.langue}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Vue: Finance ──────────────────────────────────────────────────────────
function FinanceView({ etudiants, employes }) {
    const masseSalariale = employes.reduce((a, b) => a + (b.salaire || 0), 0);
    return (
        <div style={styles.card}>
            <h3>Suivi Financier Global</h3>
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                <div style={styles.miniStat}>
                    <small>Masse Salariale</small>
                    <div style={{ fontWeight: 900, color: RED }}>{masseSalariale.toLocaleString()} DA</div>
                </div>
                <div style={styles.miniStat}>
                    <small>Paiements Scolarité</small>
                    <div style={{ fontWeight: 900, color: GREEN }}>Reçus</div>
                </div>
            </div>
        </div>
    );
}

// ── Composants Réutilisables ──
function StatCard({ title, value, color, icon }) {
    return (
        <div style={{ ...styles.statCard, borderLeft: `5px solid ${color}` }}>
            <span style={{ fontSize: 32 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>{value}</div>
            </div>
        </div>
    );
}

// ── Styles (CSS-in-JS) ─────────────────────────────────────────────────────
const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Inter, sans-serif' },
    sidebar: { width: 260, backgroundColor: '#0f172a', color: 'white', padding: '25px 20px', display: 'flex', flexDirection: 'column' },
    logo: { fontSize: 20, fontWeight: 900, marginBottom: 40, color: '#60a5fa', textAlign: 'center' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8 },
    navBtn: { padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: 10, fontSize: 14, transition: '0.3s' },
    navBtnActive: { padding: '12px 15px', textAlign: 'left', background: ACCENT, border: 'none', color: 'white', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 700 },
    content: { flex: 1, padding: '40px', overflowY: 'auto' },
    header: { marginBottom: 30, color: '#0f172a', fontWeight: 800, fontSize: 28 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 30 },
    statCard: { backgroundColor: 'white', padding: '25px', borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', gap: 20, alignItems: 'center' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: 13, textTransform: 'uppercase' },
    td: { padding: '15px', borderBottom: '1px solid #f1f5f9', fontSize: 14, color: '#334155' },
    tr: { transition: '0.2s', cursor: 'default' },
    roleBadge: { backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#475569' },
    actionBtn: { backgroundColor: ACCENT, color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 600 },
    gridFormations: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginTop: 20 },
    formationItem: { padding: '20px', borderRadius: 15, border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#fcfcfc' },
    miniStat: { flex: 1, padding: 15, backgroundColor: '#f8fafc', borderRadius: 12, textAlign: 'center' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: 18, color: ACCENT, fontWeight: 700 },
    logoutBtn: { marginTop: 'auto', padding: '12px', background: '#ef444415', color: RED, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }
};