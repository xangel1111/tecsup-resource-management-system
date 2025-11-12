import { useEffect, useState } from 'react';

import './CubiclesPage.css'; 
import UserNavbar from '../../components/UserNavbar';

import ReservarCubiculos from './CubiclesReservation';
import MisReservas from './MyReservations';
import cubiclesApi from '../../api/cubiclesApi'

const CubiculosPage = () => {

  const [cubicles, setCubicles] = useState();
  const [reservations, setReservations] = useState();

  useEffect(() => {
    const fetchCubicles = async () => {
      try {
        const data = await cubiclesApi.getAllCubicles();
        setCubicles(data);
      } catch (error) {
        console.error("Error al obtener cubículos:", error);
      }
    }

    const fetchReservations = async () => {
      try {
        const data2 = (await cubiclesApi.getAllReservations()).reservations;
        setReservations(data2);
      } catch (error) {
        console.error("Error al obtener cubículos:", error);
      }
    };

    fetchCubicles();
    fetchReservations();
  }, []);

  useEffect(() => {
  }, [cubicles]);

  useEffect(() => {
  }, [reservations]);

  const [activeTab, setActiveTab] = useState('reservar');

  return (
    <div className="page-container">
      {/* 1. El Navbar va en el componente padre */}
      <UserNavbar activePage="cubiculos" />

      {/* 2. El Contenido Principal */}
      <main className="reservation-content">
        
        {/* 3. El Contenedor de Pestañas (ahora con lógica onClick) */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'reservar' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservar')}
          >
            Reservar Cubículo
          </button>
          <button
            className={`tab-btn ${activeTab === 'misreservas' ? 'active' : ''}`}
            onClick={() => setActiveTab('misreservas')}
          >
            Reservas
          </button>
        </div>

        {/* 4. Contenido Condicional */}
        {activeTab === 'reservar' && <ReservarCubiculos 
          reservations={ reservations }
          setReservations={ setReservations }
        />}
        {activeTab === 'misreservas' && <MisReservas 
          reservations={ reservations }
          setReservations={ setReservations }
        />}
      </main>
    </div>
  );
};

export default CubiculosPage;