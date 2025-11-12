import React, { useState } from 'react';
import './AdminLayout.css';
import tecsupLogo from '../../assets/tecsup-logo.png';

// Importa los componentes de Cubículos
import ReservasPendientes from './ReservationsPending';
import HistorialReservas from './ReservationsHistory';
// Importa los componentes de Herramientas
import SolicitudesPendientes from './LoansPending';
import HistorialPrestamos from './LoansHistory';
// IMPORTA EL NUEVO COMPONENTE
import CrudHerramientas from './ToolCrud';

// Importa íconos
import { FaBell, FaCog, FaSignOutAlt, FaSearch, FaTools } from 'react-icons/fa';
import { getUser, logout } from '../../auth/auth';

// Logo
//const tecsupLogoUrl = 'https://www.tecsup.edu.pe/sites/all/themes/tecsup/logo.png';
const tecsupLogoUrl = tecsupLogo;

const AdminLayout = () => {
  const [activeView, setActiveView] = useState('reservasPendientes'); 

  const username = getUser().email;

  const isBiblioteca = username === 'biblioteca@tecsup.edu.pe';
  const isRedes = username === 'redes@tecsup.edu.pe';

  const Sidebar = () => (
    <nav className="admin-sidebar">
      {/* === SECCIÓN CUBÍCULOS === */}
      {(!isRedes) && (
        <div className="sidebar-group">
          <h4>Cubículos</h4>
          <button
            className={`sidebar-link ${activeView === 'reservasPendientes' ? 'active' : ''}`}
            onClick={() => setActiveView('reservasPendientes')}
          >
            Reservas Pendientes
          </button>
          <button
            className={`sidebar-link ${activeView === 'historialReservas' ? 'active' : ''}`}
            onClick={() => setActiveView('historialReservas')}
          >
            Historial de Reservas
          </button>
        </div>
      )}

      {/* === SECCIÓN HERRAMIENTAS === */}
      {(!isBiblioteca) && (
        <div className="sidebar-group">
          <h4>Herramientas</h4>
          <button
            className={`sidebar-link ${activeView === 'solicitudesPendientes' ? 'active' : ''}`}
            onClick={() => setActiveView('solicitudesPendientes')}
          >
            Solicitudes Pendientes
          </button>
          <button
            className={`sidebar-link ${activeView === 'historialPrestamos' ? 'active' : ''}`}
            onClick={() => setActiveView('historialPrestamos')}
          >
            Historial de Préstamos
          </button>
          <button
            className={`sidebar-link ${activeView === 'crudHerramientas' ? 'active' : ''}`}
            onClick={() => setActiveView('crudHerramientas')}
          >
            <FaTools /> Gestionar Herramientas
          </button>
        </div>
      )}

      {/* === SECCIÓN CUENTA === */}
      <div className="sidebar-group">
        <h4>Cuenta</h4>
        <button className="sidebar-link">
          <FaBell /> Notificaciones
        </button>
        <button className="sidebar-link">
          <FaCog /> Configuración
        </button>
        <button className="sidebar-link" onClick={logout}>
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </nav>
  );

  // Componente de barra superior (Sin cambios)
  const Header = () => (
    <header className="admin-header">
      <img src={tecsupLogoUrl} alt="Tecsup" className="admin-logo" />
      <div className="admin-search-bar">
        <FaSearch />
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="admin-header-user">
        <FaBell />
        <span className="notification-badge">2</span>
      </div>
    </header>
  );

  // Función para renderizar el contenido (Actualizada)
  const renderActiveView = () => {
    switch (activeView) {
      case 'reservasPendientes':
        return <ReservasPendientes />;
      case 'historialReservas':
        return <HistorialReservas />;
      case 'solicitudesPendientes':
        return <SolicitudesPendientes />;
      case 'historialPrestamos':
        return <HistorialPrestamos />;
      case 'crudHerramientas': // --- NUEVO CASE ---
        return <CrudHerramientas />;
      default:
        return <ReservasPendientes />;
    }
  };

  return (
    <div className="admin-layout">
      <Header />
      <Sidebar />
      <main className="admin-content-area">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default AdminLayout;