import { Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Enseignant from './pages/Enseignant'
import Secretaire from './pages/Secretaire'
import Eleve      from './pages/eleve'

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Navigate to="/login" replace />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/enseignant"  element={<Enseignant />} />
      <Route path="/secretaire"  element={<Secretaire />} />
      <Route path="/eleve"       element={<Eleve />} />
      <Route path="*"            element={<Navigate to="/login" replace />} />
    </Routes>
  )
}