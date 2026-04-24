import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// استيراد الدوال الحسابية فقط من shared
import {
  CLASSES, calcMoyenne, moyenneClass, calcPromotion, todayStr, ELEVES_INIT
} from '../data/shared'

const API_URL = "http://localhost:3000/api";

// --- المكونات المساعدة (LOGO, CircleProgress, Sidebar) تبقى كما هي ---
const LOGO = (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <rect width="56" height="56" rx="14" fill="#4f8ef7"/>
    <text x="28" y="38" textAnchor="middle" fontSize="28" fill="white" fontFamily="Arial">🎓</text>
  </svg>
)

// ... (يمكنك الاحتفاظ بكل مكونات الـ UI من الكود الثاني هنا) ...

export default function ProfDashboard() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('dashboard')
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 1. جلب البيانات الفعلية من السيرفر عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/students`)
        setEleves(res.data)
      } catch (err) {
        console.error("Erreur API:", err)
        setError("Impossible de charger les données.")
        // fallback للبيانات الوهمية في حالة تعطل السيرفر أثناء التجربة
        setEleves(ELEVES_INIT) 
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 2. دالة تحديث النقاط (تتصل بالباك-إند)
  const handleUpdateNote = async (id, field, val) => {
    const numVal = val === '' ? null : Math.min(20, Math.max(0, Number(val)));
    
    // تحديث الواجهة فوراً (Optimistic Update)
    setEleves(prev => prev.map(e => e.id === id ? { ...e, [field]: numVal } : e))

    try {
      await axios.put(`${API_URL}/students/${id}`, { [field]: numVal })
    } catch (err) {
      console.error("Update failed:", err)
      alert("Erreur lors de la sauvegarde sur le serveur")
    }
  }

  // 3. دالة حذف طالب (تتصل بالباك-إند)
  const handleDeleteEleve = async (id) => {
    if(!window.confirm("Supprimer cet élève ?")) return
    try {
      await axios.delete(`${API_URL}/students/${id}`)
      setEleves(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
  }

  // 4. دالة إضافة طالب جديد (تتصل بالباك-إند)
  const handleAjouterEleve = async (newEleve) => {
    try {
      const res = await axios.post(`${API_URL}/students`, newEleve)
      setEleves(prev => [...prev, res.data])
    } catch (err) {
      alert("Erreur lors de l'ajout")
    }
  }

  if (loading) return <div className="loading-screen">Chargement des données en cours...</div>

  return (
    <div className="app-container">
      {/* الـ Sidebar كما هي مع تمرير دوال التنقل */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* عرض الصفحات بناءً على الحالة النشطة مع تمرير البيانات الحقيقية */}
      {activePage === 'dashboard' && (
        <Dashboard eleves={eleves} onNavigate={setActivePage} />
      )}

      {activePage === 'notes' && (
        <Notes 
          eleves={eleves} 
          onUpdateNote={handleUpdateNote} 
          onDelete={handleDeleteEleve} 
          onAjouter={handleAjouterEleve} 
        />
      )}

      {/* باقي الصفحات (Cours, Absence, EDT) تظهر بنفس واجهاتها الجميلة */}
      {activePage === 'cours' && <PageCours />}
      {activePage === 'absence' && <Absences eleves={eleves} />} 
      {activePage === 'edt' && <EDT />}
    </div>
  )
}