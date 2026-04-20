import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USERS } from '../data/shared'

// Logo SVG inline (replace with your actual logo)
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

  function handleLogin() {
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = USERS[username.trim().toLowerCase()]
      if (!user || user.password !== password) {
        setError("Nom d'utilisateur ou mot de passe incorrect.")
        setLoading(false)
        return
      }
      // Smart routing: admin → /secretaire, everyone else → /enseignant
      const role = user.role

if (role === 'secretaire') {
  navigate('/secretaire')
}
else if (role === 'enseignant') {
  navigate('/enseignant')
}
else if (role === 'eleve') {
  navigate('/eleve')
}
    }, 900)
  }

  return (
    <div className="login-page">
      <div className="login-glass-orb login-orb-1" />
      <div className="login-glass-orb login-orb-2" />
      <div className="login-glass-orb login-orb-3" />

      <div className="login-card">
        {/* ── LEFT PANEL ── */}
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

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-right-header">
            <h3>Connexion</h3>
            <p>Accédez à votre espace personnel</p>
          </div>

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

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

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
