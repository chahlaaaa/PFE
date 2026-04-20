const { useState, useEffect } = React;

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("secretaire");

  const roles = [
    { value: "enseignant", label: "Enseignant(e)" },
    { value: "secretaire", label: "Secrétaire" },
    { value: "eleve",      label: "Élève" },
    { value: "parent",     label: "Parent" },
    { value: "directeur",  label: "Directeur" },
  ];

  function handleLogin() {
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.data.token);
        onLogin(data.data.user.role); 
      } else {
        alert(data.message || "خطأ في بيانات الدخول");
      }
    })
    .catch(err => alert("تعذر الاتصال بالسيرفر. تأكد أن سيرفر Node.js يعمل على المنفذ 5000"));
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <div className="login-logo">
            <div className="login-logo-icon">
               {/* حل مشكلة الصورة البيضاء: إذا لم توجد LOGO_B64 سيظهر رمز 🏫 */}
               {typeof LOGO_B64 !== 'undefined' ? <img src={LOGO_B64} alt="logo" /> : <span>🏫</span>}
            </div>
            <span>Ways of success</span>
          </div>
          <h2>Bienvenue sur notre<br />plateforme collaborative !</h2>
        </div>
        <div className="login-right">
          <h3>Connexion</h3>
          <div className="login-field">
            <label className="login-label">Rôle</label>
            <select className="login-select" value={role} onChange={e => setRole(e.target.value)}>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="login-field">
            <label className="login-label">Nom d'utilisateur</label>
            <input className="login-input" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="login-field">
            <label className="login-label">Mot de passe</label>
            <input className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="login-btn" onClick={handleLogin}>Se connecter <span>→</span></button>
        </div>
      </div>
    </div>
  );
}
// --- المكون الرئيسي App ---
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  // التحقق من الجلسة عند تحديث الصفحة
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserRole(user.role);
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setLoggedIn(true);
  };

  // إذا لم يسجل الدخول، اعرض صفحة الـ Login
  if (!loggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  // إذا سجل الدخول، اعرض صفحة السكرتيرة (Dashboard)
  return (
    <div>
       {/* تأكد أن مكون Dashboard معرف في ملفك أو ملف shared.js */}
       <Dashboard onLogout={() => {
         localStorage.removeItem('user');
         setLoggedIn(false);
       }} />
    </div>
  );
}

// الآن سيعمل هذا السطر لأن App أصبح معرفاً
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
