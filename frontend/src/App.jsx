import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LoginScreen from './pages/Login/LoginScreen';
import HomePage from './pages/HomePage';
import CubiclesPage from './pages/cubicles/CubiclesPage';
import ToolsPage from './pages/tools/ToolsPage';
import AdminLayout from './pages/admin/AdminLayout';

import LoginSuccess from "./pages/Login/LoginSucess";

import ProtectedRoute from './auth/ProtectedRoute';
import { isAuthenticated, logout } from './auth/auth';


const Logout = () => {
  logout();
  return <Navigate to="/login" />;
};

function App() {
  const isAuth = isAuthenticated(); // Revisa el estado de auth una vez

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Ruta de Login */}
        {/* Si ya está logueado, lo mandamos a /home */}
        <Route 
          path="/login" 
          element={isAuth ? <Navigate to="/home" /> : <LoginScreen />} 
        />
        <Route 
          path="/login/success" 
          element={isAuth ? <Navigate to="/home" /> : <LoginSuccess />} 
        />
        
        {/* Ruta de Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* --- RUTAS DE USUARIO PROTEGIDAS --- */}
        <Route 
          path="/home" 
          element={<ProtectedRoute element={<HomePage />} />} 
        />
        <Route 
          path="/cubicles" 
          element={<ProtectedRoute element={<CubiclesPage />} />} 
        />
        <Route 
          path="/tools" 
          element={<ProtectedRoute element={<ToolsPage />} />} 
        />

        {/* --- RUTA DE ADMIN PROTEGIDA CON ROL --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute 
              element={<AdminLayout />} 
              requiredRole="admin" // Aquí está la magia
            />
          } 
        />

        {/* Ruta por defecto */}
        {/* Ahora redirige a /home si está logueado, o a /login si no */}
        <Route 
          path="/" 
          element={<Navigate to={isAuth ? "/home" : "/login"} />} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;