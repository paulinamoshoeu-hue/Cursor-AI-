import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/resident/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ComplaintDetail from './pages/resident/ComplaintDetail';
import { AuthProvider, useAuth } from './auth/AuthContext';

function Protected({ roles, children }: { roles?: Array<'RESIDENT' | 'ADMIN'>; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/resident"
          element={
            <Protected roles={["RESIDENT"]}>
              <ResidentDashboard />
            </Protected>
          }
        />
        <Route
          path="/resident/complaints/:id"
          element={
            <Protected roles={["RESIDENT", "ADMIN"]}>
              <ComplaintDetail />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected roles={["ADMIN"]}>
              <AdminDashboard />
            </Protected>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}


