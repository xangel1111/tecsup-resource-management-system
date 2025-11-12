// --- DATOS DE EJEMPLO ---
const bookingHistory = [
  { id: 1, fecha: '2025/10/04', cubiculo: 2, alumno: 'Alumno 3', estado: 'Completado' },
  { id: 2, fecha: '2025/10/03', cubiculo: 1, alumno: 'Alumno 4', estado: 'Completado' },
  { id: 3, fecha: '2025/10/02', cubiculo: 5, alumno: 'Alumno 5', estado: 'Cancelado' },
  { id: 4, fecha: '2025/10/01', cubiculo: 2, alumno: 'Alumno 1', estado: 'No Asistió' },
];
// --- FIN DE DATOS DE EJEMPLO ---

import "./AdminLayout.css";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import cubiclesApi from "../../api/cubiclesApi";
import usersApi from "../../api/usersApi";

// 🔹 Componente para mostrar el estado
const StatusTag = ({ estado }) => {
  let className = "status-tag";
  if (estado === "Completado") className += " completed";
  if (estado === "Cancelado") className += " cancelled";
  if (estado === "No Asistió") className += " no-show";
  return <span className={className}>{estado}</span>;
};

const HistorialReservas = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔹 Obtener reservas no pendientes (historial)
  const getAllNotPending = async () => {
    try {
      const data = await cubiclesApi.getAllNotPending(); // endpoint /bookings/not-pending
      setBookings(data);
    } catch (error) {
      console.error("Error al obtener historial de reservas:", error);
    }
  };

  // 🔹 Obtener todos los usuarios
  const getAllUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // 🔹 Llamar a las APIs al cargar el componente
  useEffect(() => {
    getAllNotPending();
    getAllUsers();
  }, []);



  // 🔹 Combinar reservas + usuarios
  const bookingHistory = bookings.map((booking) => {
    const user = users.find((u) => u.id === booking.userId);

    // Mapear estado del backend a texto legible
    let estado = "";
    switch (booking.status) {
      case "accepted":
        estado = "Completado";
        break;
      case "cancelled":
        estado = "Cancelado";
        break;
      case "declined":
        estado = "No Asistió";
        break;
      default:
        estado = booking.status;
    }

    return {
      id: booking.id,
      fecha: new Date(booking.startTime).toLocaleDateString(),
      cubiculo: booking.Cubicle?.name || `Cubículo ${booking.cubicleId}`,
      alumno: user ? user.email : "Desconocido",
      estado,
    };
  });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h2>Historial de Reservas</h2>
        <div className="history-filters">
          <input type="date" className="date-filter" />
          <div className="admin-search-bar small">
            <FaSearch />
            <input type="text" placeholder="Buscar por alumno o cubículo..." />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cubículo</th>
              <th>Alumno (Email)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.fecha}</td>
                <td>{booking.cubiculo}</td>
                <td>{booking.alumno}</td>
                <td>
                  <StatusTag estado={booking.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button>&laquo;</button>
        <button className="active">1</button>
        <button>&raquo;</button>
      </div>
    </div>
  );
};

export default HistorialReservas;