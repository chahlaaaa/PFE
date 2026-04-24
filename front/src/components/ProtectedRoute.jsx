import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // جلب التوكن وبيانات المستخدم من التخزين المحلي
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); 

    // 1. إذا لم يكن هناك توكن (المستخدم لم يسجل دخوله أصلاً)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. إذا كان هناك توكن، ولكن دور المستخدم غير مسموح له بدخول هذه الصفحة
    // مثال: طالب (eleve) يحاول الدخول لصفحة المدير (directeur)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" replace />;
    }

    // 3. إذا كان كل شيء سليمًا، اعرض الصفحة المطلوبة
    return children;
};

export default ProtectedRoute;