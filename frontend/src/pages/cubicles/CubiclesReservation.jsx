import { useState } from 'react';
import './CubiclesPage';
import ReservaModal from './CubiclesModal';
import cubiclesApi from '../../api/cubiclesApi';

// Obtenemos la fecha de hoy
const getTodayDate = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
};

// Obtener fecha de una semana después
const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7); // +7 días
  maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
  return maxDate.toISOString().split('T')[0];
};

const cubiculosData = [
  { id: 1, nombre: 'Cubículo 1', reservasHoy: 0 },
  { id: 2, nombre: 'Cubículo 2', reservasHoy: 0 },
  { id: 3, nombre: 'Cubículo 3', reservasHoy: 0 },
  { id: 4, nombre: 'Cubículo 4', reservasHoy: 0 },
];

const ReservarCubiculos = ({reservations, setReservations}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCubicle, setSelectedCubicle] = useState(null);

  const handleOpenModal = (cubiculo) => {
    setSelectedCubicle(cubiculo);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedCubicle(null);
    const response = await cubiclesApi.getAllReservations();
    setReservations(response.reservations);
  };

  return (
    // Usamos un Fragment (<>) porque ya no hay un div contenedor
    <>
      {/* --- Selector de Fecha --- */}
      <div className="date-selector-card">
        <h3>Seleccionar fecha</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayDate()}
            max={getMaxDate()}
            className="date-input"
          />
      </div>

      {/* --- Contenedor de Cubículos --- */}
      <div className="cubicles-container">
        <h2>Cubículos disponibles</h2>
        <div className="cubicles-grid">
          {cubiculosData.map((cubiculo) => (
            <div className="cubicle-card" key={cubiculo.id}>
              <h4>{cubiculo.nombre}</h4>
              <p>Reservas del día: {cubiculo.reservasHoy}</p>
              <button
                className="reserve-btn"
                onClick={() => handleOpenModal(cubiculo)}
              >
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- El Modal (sigue perteneciendo a esta vista) --- */}
      {isModalOpen && (
        <ReservaModal
          reservations={reservations}
          cubicle={selectedCubicle}
          date={selectedDate}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ReservarCubiculos;