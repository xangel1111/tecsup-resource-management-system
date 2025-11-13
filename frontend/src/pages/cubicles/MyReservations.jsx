import cubiclesApi from '../../api/cubiclesApi';
import { getUser } from '../../auth/auth'; // Asegúrate de importar getUser

const MisReservas = ({ reservations, setReservations }) => {
  const userId = getUser().id;

  const upcomingBookings = [ { id: 2, nombre: 'Cubículo 1', fecha: '2025-11-10', hora: '09:00 AM', duracion: '2 horas', }, { id: 3, nombre: 'Cubículo 4', fecha: '2025-11-12', hora: '02:00 PM', duracion: '1 hora', }, ];

  // 🔹 Filtra solo las reservas del usuario actual
  const userReservations = reservations.filter(r => r.userId === userId);

  function formatReservation(reservation) {
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);

    const today = new Date();
    const isToday = start.toDateString() === today.toDateString();

    const fecha = isToday
      ? `Hoy, ${start.getDate()} de ${start.toLocaleString('es-PE', { month: 'long' })}`
      : `${start.getDate()} de ${start.toLocaleString('es-PE', { month: 'long' })}`;

    const formatTime = (date) =>
      date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

    const hora = `${formatTime(start)} - ${formatTime(end)}`;

    return {
      id: reservation.id,
      nombre: `Cubículo ${reservation.cubicleId}`,
      fecha,
      hora
    };
  }

  // 🔹 Reserva activa: la primera del array filtrado
  const activeBooking = userReservations.length > 0
    ? formatReservation(userReservations[0])
    : null;

  // 🔹 Reservas pasadas o futuras (según lo que necesites)
  const pastBookings = userReservations.slice(1).map(formatReservation);

  const cancelReservation = async (reservationId) => {
    try {
      await cubiclesApi.cancelReservation({ reservationId });

      const updatedReservations = userReservations.filter(r => r.id !== reservationId);
      setReservations(updatedReservations);
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  return (
    <>
      {/* --- Reserva Activa --- */}
      <div className="booking-section-container">
        <h2>Tu Reserva Activa</h2>
        {activeBooking ? (
          <div className="active-booking-card">
            <h3>{activeBooking.nombre}</h3>
            <p className="active-time">{activeBooking.hora}</p>
            <p className="active-date">{activeBooking.fecha}</p>
            <button
              className="btn-cancel-active"
              onClick={() => cancelReservation(activeBooking.id)}
            >
              Cancelar Reserva
            </button>
          </div>
        ) : (
          <div className="no-booking-message">
            <p>No tienes ninguna reserva activa en este momento.</p>
          </div>
        )}
      </div>

      {/* --- Reservas anteriores --- */}
      <div className="booking-section-container">
        <h2>Mis Anteriores Reservas</h2>
        {upcomingBookings.length > 0 ? (
          <div className="booking-list">
            {upcomingBookings.map((booking) => (
              <div className="booking-list-item" key={booking.id}>
                <div className="booking-item-info">
                  <h4>{booking.nombre}</h4>
                  <p>{booking.fecha} | {booking.hora}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-booking-message">
            <p>No tienes reservas anteriores.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MisReservas;