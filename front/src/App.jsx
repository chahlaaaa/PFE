import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' // استيراد المكون الجديد
import Login from './pages/Login'
import Enseignant from './pages/Enseignant'
import Secretaire from './pages/Secretaire'
import Eleve from './pages/eleve'
import Directeur from './pages/directeur'
import Superviseur from './pages/superviseur'
import Parent from './pages/parent'

export default function App() {
  return (
    <Routes>
      {/* المسارات العامة */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* المسارات المحمية - لا يمكن دخولها إلا بتسجيل دخول ودور صحيح */}
      
      <Route 
        path="/enseignant" 
        element={<ProtectedRoute allowedRoles={['enseignant']}><Enseignant /></ProtectedRoute>} 
      />
      
      <Route 
        path="/secretaire" 
        element={<ProtectedRoute allowedRoles={['secretaire']}><Secretaire /></ProtectedRoute>} 
      />
      
      <Route 
        path="/eleve" 
        element={<ProtectedRoute allowedRoles={['eleve']}><Eleve /></ProtectedRoute>} 
      />
      
      <Route 
        path="/directeur" 
        element={<ProtectedRoute allowedRoles={['directeur']}><Directeur /></ProtectedRoute>} 
      />
      
      <Route 
        path="/superviseur" 
        element={<ProtectedRoute allowedRoles={['superviseur']}><Superviseur /></ProtectedRoute>} 
      />
      
      <Route 
        path="/parent" 
        element={<ProtectedRoute allowedRoles={['parent']}><Parent /></ProtectedRoute>} 
      />

      {/* أي مسار غير معروف يعيد المستخدم للوجن */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}