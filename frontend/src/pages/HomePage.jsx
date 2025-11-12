import './HomePage.css';
import { NavLink } from 'react-router';
import UserNavbar from '../components/UserNavbar';
import { getUser } from '../auth/auth';

// Imágenes para las tarjetas
const libraryImgUrl = 'https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const networkImgUrl = 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';


const HomePage = () => {
  const username = getUser().email; // por ejemplo: "nombre.apellido@tecsup.edu.pe"
  const isSpecialUser = username === 'rojan.lopez@tecsup.edu.pe';

  return (
    <div className="dashboard-page">
      {/* --- Barra de Navegación Superior --- */}
      <UserNavbar activePage="herramientas" />

      {/* --- Contenido Principal (Tarjetas) --- */}
      <main className="dashboard-content">
        <div className="card-container">
          
          {/* Tarjeta 1: Cubículos Estudiantiles */}
          <div className="service-card">
            <img src={libraryImgUrl} alt="Biblioteca con estudiantes" className="card-image" />
            <div className="card-content">
              <h2 className="card-title">Cubículos Estudiantiles</h2>
              <p className="card-description">
                Reserva cubículos estudiantiles para tener un entorno tranquilo y adecuado.
              </p>
              <NavLink to="/cubicles">
                <button className="card-button">Ver ahora</button>
              </NavLink>
            </div>
          </div>

          {/* Tarjeta 2: Herramientas de Redes — solo si NO es el usuario especial */}
          {!isSpecialUser && (
            <div className="service-card">
              <img src={networkImgUrl} alt="Cables de red en un servidor" className="card-image" />
              <div className="card-content">
                <h2 className="card-title">Herramientas de Redes</h2>
                <p className="card-description">
                  Solicita el préstamo de las herramientas que necesites para tus proyectos.
                </p>
                <NavLink to="/tools">
                  <button className="card-button">Ver ahora</button>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;