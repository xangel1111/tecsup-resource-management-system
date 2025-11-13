import { useEffect, useState } from 'react';
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

import DashBoardReservas from './DashBoardReservas';

// Importa íconos
import { FaBell, FaCog, FaSignOutAlt, FaSearch, FaTools } from 'react-icons/fa';
import { getUser, logout } from '../../auth/auth';
import usersApi from '../../api/usersApi';
import cubiclesApi from '../../api/cubiclesApi';
import loansApi from '../../api/loansApi';
import DashBoardPrestamos from './DashBoardPrestamos';

// Logo
//const tecsupLogoUrl = 'https://www.tecsup.edu.pe/sites/all/themes/tecsup/logo.png';
const tecsupLogoUrl = tecsupLogo;

const AdminLayout = () => {
  const [activeView, setActiveView] = useState('reservasPendientes'); 


  const [users, setUsers] = useState();
  const [reservations, setReservations] = useState();

  const [tools, setTools] = useState();
  const [loans, setLoans] = useState();

  const getAllUsers = async () => {
    const data = await usersApi.getUsers();
    setUsers(data);
  };

  const getAllReservations = async () => {
    const data = (await cubiclesApi.getAllNotPending());
    setReservations(data)
  };

  const getAllEquipments = async () => {
    const data = (await loansApi.getAllTools());
    setTools(data)
  };

  const getAllLoans = async () => {
    const data = (await loansApi.getNotPendingLoans());
    console.log(data)
    setLoans(data)
  };

  useEffect(() => {
    getAllUsers();
    getAllReservations();
    getAllEquipments();
    getAllLoans();
  },[]);

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
          <button
            className={`sidebar-link ${activeView === 'dashboardReservas' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboardReservas')}
          >
            Dashboard
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
            className={`sidebar-link ${activeView === 'dashboardPrestamos' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboardPrestamos')}
          >
            Dashboard
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
        return <ReservasPendientes 
          getAllNotPending={getAllReservations}
        />;
      case 'historialReservas':
        return <HistorialReservas />;
      case 'dashboardReservas':
        return <DashBoardReservas
          reservations={reservations}
          users={users}
          />;
      case 'solicitudesPendientes':
        return <SolicitudesPendientes
          getAllNotPending={getAllLoans}
        />;
      case 'historialPrestamos':
        return <HistorialPrestamos />;
      case 'dashboardPrestamos':
        return <DashBoardPrestamos
          equipments={tools}
          users={users}
          loans={loans}
          />;
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