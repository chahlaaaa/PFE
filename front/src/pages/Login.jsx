import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api' // استيراد الربط مع السيرفر

// Logo SVG
const LOGO = (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <rect width="56" height="56" rx="14" fill="#4f8ef7"/>
    <text x="28" y="38" textAnchor="middle" fontSize="28" fill="white" fontFamily="Arial">🎓</text>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [focused,  setFocused]  = useState(null)

  // الدالة المعدلة للاتصال بالسيرفر
  async function handleLogin() {
    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError('')
    setLoading(true)

    try {
      // الاتصال بـ API تسجيل الدخول
      const response = await authAPI.login(username.trim(), password);

      if (response.success) {
        // استخراج الدور (Role) من بيانات السيرفر
        const role = response.data.user.role;

        // التوجيه الذكي بناءً على الدور
        const routes = {
          secretaire: '/secretaire',
          enseignant: '/enseignant',
          eleve: '/eleve',
          directeur: '/directeur',
          superviseur: '/superviseur',
          parent: '/parent'
        };

        const targetRoute = routes[role];
        
        if (targetRoute) {
          navigate(targetRoute);
        } else {
          setError("Rôle non reconnu.");
        }
      }
    } catch (err) {
      // عرض خطأ السيرفر (مثل: Identifiants incorrects)
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* المؤثرات البصرية (Orbs) */}
      <div className="login-glass-orb login-orb-1" />
      <div className="login-glass-orb login-orb-2" />
      <div className="login-glass-orb login-orb-3" />

      <div className="login-card">
        {/* اللوحة اليسرى */}
        <div className="login-left">
          <div className="login-logo">
            <div className="login-logo-icon">{LOGO}</div>
            <span>Ways of success</span>
          </div>
          <h2>Bienvenue sur notre<br />plateforme collaborative !</h2>
          {[
            ['📊','Suivi pédagogique en temps réel'],
            ['💬','Communication centralisée'],
            ['📅','Planification simplifiée'],
          ].map(([icon, text], i) => (
            <div className="login-feature" key={text} style={{ animationDelay:`${.3+i*.15}s` }}>
              <div className="login-feature-icon">{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* اللوحة اليمنى */}
        <div className="login-right">
          <div className="login-right-header">
            <h3>Connexion</h3>
            <p>Accédez à votre espace personnel</p>
          </div>

          {/* حقل اسم المستخدم */}
          <div className={`login-field login-field-animated ${focused==='user'?'is-focused':''}`}>
            <label className="login-label">
              <span className="login-field-icon">👤</span> Nom d'utilisateur
            </label>
            <input className="login-input"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              onFocus={() => setFocused('user')}
              onBlur={() => setFocused(null)}
              onKeyDown={e => e.key==='Enter' && handleLogin()}
              autoComplete="username"
              placeholder="ex: a.mansouri"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className={`login-field login-field-animated ${focused==='pass'?'is-focused':''}`}>
            <label className="login-label">
              <span className="login-field-icon">🔒</span> Mot de passe
            </label>
            <input className="login-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onFocus={() => setFocused('pass')}
              onBlur={() => setFocused(null)}
              onKeyDown={e => e.key==='Enter' && handleLogin()}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {/* عرض الأخطاء */}
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* زر تسجيل الدخول */}
          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading
              ? <span className="login-spinner" />
              : <><span className="login-btn-text">Se connecter</span><span className="login-btn-arrow">→</span></>
            }
          </button>

          <div className="login-hint">
            Le système détecte votre rôle automatiquement
          </div>
        </div>
      </div>
    </div>
  )
}