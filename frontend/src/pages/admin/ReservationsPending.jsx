import './AdminLayout.css'; // Reutiliza la misma hoja de estilos

// --- DATOS DE EJEMPLO ---
const pendingBookings = [
  { id: 1, fecha: '2025/10/05 10:57:46', cubiculo: 3, alumno: 'angel.delgado@tecsup.edu.pe', duracion: '2h' },
  { id: 2, fecha: '2025/10/02 10:57:46', cubiculo: 2, alumno: 'fernando.aquino@tecsup.edu.pe', duracion: '1h' },
  { id: 3, fecha: '2025/10/01 10:57:46', cubiculo: 4, alumno: 'fernando.aquino@tecsup.edu.pe', duracion: '2h' },
  { id: 4, fecha: '2025/10/01 09:30:00', cubiculo: 'angel.delgado@tecsup.edu.pe', alumno: 'Alumno 2', duracion: '3h' },
];
// --- FIN DE DATOS DE EJEMPLO ---

import { useEffect, useState } from "react";
import cubiclesApi from "../../api/cubiclesApi";
import usersApi from "../../api/usersApi";

const ReservasPendientes = () => {
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [pendingBookings, setPendingBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Filtros (puedes cambiarlos por tus nombres de cubículos reales)
  const filters = ["TODOS", "Biblioteca", "Lab. Redes", "Lab. A", "Lab. B"];

  // 🔹 Obtener reservas pendientes desde la API
  const getPendingBookings = async () => {
    try {
      const data = await cubiclesApi.getAllPending();
      setPendingBookings(data);
    } catch (error) {
      console.error("Error al obtener reservas pendientes:", error);
    }
  };

  // 🔹 Obtener todos los usuarios (para mostrar el email)
  const getAllUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const acceptReservation = async (id) => {
    try {
      const data = await cubiclesApi.acceptReservation(id);
      await getPendingBookings();
    } catch (error) {
      console.error("Error al aceptr rerer:", error);
    }
  };

  // 🔹 Llamar ambas APIs al montar el componente
  useEffect(() => {
    getPendingBookings();
    getAllUsers();
  }, []);

  // 🔹 Unir reservas + usuarios
  const combinedBookings = pendingBookings.map((booking) => {
    const user = users.find((u) => u.id === booking.userId);
    return {
      id: booking.id,
      fecha: new Date(booking.startTime).toLocaleDateString(),
      cubiculo: booking.Cubicle?.name || `Cubículo ${booking.cubicleId}`,
      alumno: user ? user.email : "Desconocido",
      duracion: calcularDuracion(booking.startTime, booking.endTime),
    };
  });

  // 🔹 Filtro por tipo de cubículo
  const filteredBookings =
    activeFilter === "TODOS"
      ? combinedBookings
      : combinedBookings.filter((b) =>
          b.cubiculo.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h2>Reservas Pendientes</h2>
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cubículo</th>
              <th>Alumno (Email)</th>
              <th>Duración</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.fecha}</td>
                <td>{booking.cubiculo}</td>
                <td>{booking.alumno}</td>
                <td>{booking.duracion}</td>
                <td>
                  <a href="#" className="action-link-ingreso"
                  onClick={() => acceptReservation(booking.id)}
                  >
                    Registrar Ingreso
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación (estática) */}
      <div className="pagination">
        <button>&laquo;</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>&raquo;</button>
      </div>
    </div>
  );
};

// 🔸 Función auxiliar para calcular duración
function calcularDuracion(inicio, fin) {
  const start = new Date(inicio);
  const end = new Date(fin);
  const diffHoras = Math.round((end - start) / (1000 * 60 * 60)); // horas
  return `${diffHoras} h`;
}

export default ReservasPendientes;