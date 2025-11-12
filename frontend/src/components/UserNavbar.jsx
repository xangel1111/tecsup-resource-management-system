import { Link } from 'react-router';
import { getUser, logout } from '../auth/auth';

import tecsupLogo from '../assets/tecsup-logo.png';

import './UserNavbar.css'; // Su propia hoja de estilos

// Logo de Tecsup
const tecsupLogoUrl = tecsupLogo;
//const tecsupLogoUrl = 'https://www.tecsup.edu.pe/wp-content/uploads/2024/07/Group-680.png';
/**
 * Navbar principal para las páginas de usuario.
 * @param {object} props
 * @param {'cubiculos' | 'herramientas'} props.activePage - Para resaltar el link activo
 */
const UserNavbar = ({ activePage }) => {

  const username = getUser().email;

  const isSpecialUser = username === 'rojan.lopez@tecsup.edu.pe';

  return (
    <header className="user-navbar">
      <div className="user-navbar__logo-container">
        <img src={tecsupLogoUrl} alt="Logo Tecsup" className="user-navbar__logo" />
      </div>
      <nav className="user-navbar__nav">
        {/* Siempre visible */}
        <Link 
          to="/cubicles" 
          className={activePage === 'cubiculos' ? 'active' : ''}
        >
          Cubículos
        </Link>

        {/* Solo mostrar si NO es el usuario especial */}
        {!isSpecialUser && (
          <Link 
            to="/tools" 
            className={activePage === 'herramientas' ? 'active' : ''}
          >
            Herramientas
          </Link>
        )}

        <Link to="/login">
          <button className="user-navbar__logout-btn" onClick={logout}>Salir</button>
        </Link>
      </nav>
    </header>
  );
};

export default UserNavbar;