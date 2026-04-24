import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS (Palette originale)
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  sidebar: "#1a2236", accent: "#6c63ff", green: "#22c55e", red: "#ef4444",
  orange: "#f97316", yellow: "#eab308", blue: "#3b82f6", teal: "#14b8a6",
  pink: "#ec4899", bg: "#f0f4f8", card: "#ffffff", text: "#1e293b",
  muted: "#94a3b8", border: "#e2e8f0",
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES (Helpers)
// ═══════════════════════════════════════════════════════════════════════════
function initials(name = "") { return name.split(" ").slice(0, 2).map(n => n[0] || "").join("").toUpperCase(); }
const AVT_COLORS = [C.accent, C.green, C.orange, C.blue, C.teal, C.pink, "#8b5cf6", "#f43f5e"];
function avatarColor(name = "") { return AVT_COLORS[name.charCodeAt(0) % AVT_COLORS.length]; }

// ═══════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: avatarColor(name),
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0
    }}>
      {initials(name)}
    </div>
  );
}

function Btn({ children, onClick, color = C.accent, outline = false, small = false, style: ex = {} }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? "transparent" : color, color: outline ? color : "#fff",
      border: `2px solid ${color}`, borderRadius: 9, padding: small ? "5px 12px" : "9px 20px",
      fontWeight: 700, fontSize: small ? 12 : 13, cursor: "pointer", ...ex
    }}>{children}</button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE: GESTION ÉTUDIANTS (FULL STACK)
// ═══════════════════════════════════════════════════════════════════════════
export default function PageEtudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", ddn: "", langue: "Français", tel: "", adresse: "", groupeId: "" });

  const API_URL = "http://localhost:5000/api";

  // 1. Charger les données au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEtu, resGrp] = await Promise.all([
          axios.get(`${API_URL}/etudiants`),
          axios.get(`${API_URL}/groupes`)
        ]);
        setEtudiants(resEtu.data);
        setGroupes(resGrp.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur API:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Ajouter un étudiant (DB Sync)
  const handleSaveAdd = async () => {
    if (!form.nom || !form.prenom) return alert("Nom et Prénom requis");
    try {
      const res = await axios.post(`${API_URL}/etudiants`, form);
      setEtudiants([...etudiants, res.data]); // Mise à jour UI
      setModal(null);
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };

  // 3. Supprimer un étudiant (DB Sync)
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement cet étudiant ?")) return;
    try {
      await axios.delete(`${API_URL}/etudiants/${id}`);
      setEtudiants(etudiants.filter(e => e.id !== id));
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  const filtered = etudiants.filter(e =>
    `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text }}>Gestion des Étudiants</h2>
        <Btn onClick={() => { setForm({ nom: "", prenom: "", ddn: "", langue: "Français", tel: "", adresse: "", groupeId: "" }); setModal("add"); }}>
          + Ajouter Étudiant
        </Btn>
      </div>

      <input 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        placeholder="Rechercher un étudiant..."
        style={{ padding: "10px", width: "300px", borderRadius: "8px", border: `1.5px solid ${C.border}`, marginBottom: 20 }}
      />

      <div style={{ background: C.card, borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,.07)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              <th style={thStyle}>ÉTUDIANT</th>
              <th style={thStyle}>FORMATION</th>
              <th style={thStyle}>GROUPE</th>
              <th style={thStyle}>TÉLÉPHONE</th>
              <th style={thStyle}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: `1px solid #f8fafc` }}>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={e.nom} size={32} />
                    <span style={{ fontWeight: 700 }}>{e.nom} {e.prenom}</span>
                  </div>
                </td>
                <td style={tdStyle}>{e.langue}</td>
                <td style={tdStyle}>{e.groupe_nom || "—"}</td>
                <td style={tdStyle}>{e.tel}</td>
                <td style={tdStyle}>
                  <Btn small outline color={C.red} onClick={() => handleDelete(e.id)}>Supprimer</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout simple */}
      {modal === "add" && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Nouveau Étudiant</h3>
            <input placeholder="Nom" style={inputStyle} onChange={v => setForm({ ...form, nom: v.target.value })} />
            <input placeholder="Prénom" style={inputStyle} onChange={v => setForm({ ...form, prenom: v.target.value })} />
            <input placeholder="Téléphone" style={inputStyle} onChange={v => setForm({ ...form, tel: v.target.value })} />
            <select style={inputStyle} onChange={v => setForm({ ...form, langue: v.target.value })}>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Btn onClick={handleSaveAdd}>Enregistrer</Btn>
              <Btn outline color={C.muted} onClick={() => setModal(null)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STYLES INTERNES ──────────────────────────────────────────
const thStyle = { textAlign: "left", padding: "12px", fontSize: 11, color: C.muted, textTransform: "uppercase" };
const tdStyle = { padding: "12px", fontSize: 14, color: C.text };
const modalOverlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContentStyle = { background: "#fff", padding: 30, borderRadius: 20, width: 400 };
const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: `1px solid ${C.border}` };