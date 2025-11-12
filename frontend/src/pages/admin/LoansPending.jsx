import { useEffect, useState } from 'react';
import loansApi from '../../api/loansApi';
import usersApi from '../../api/usersApi';
import './AdminLayout.css'; // Reutiliza la misma hoja de estilos

// --- DATOS DE EJEMPLO ---
const pendingRequests = [
  { id: 1, fecha: '2025/10/05 11:00:12', herramienta: 'Crimpadora', alumno: 'Alumno 3', cantidad: 2 },
  { id: 2, fecha: '2025/10/05 10:30:05', herramienta: 'Multímetro Digital', alumno: 'Alumno 2', cantidad: 1 },
  { id: 3, fecha: '2025/10/04 15:00:00', herramienta: 'Set de Destornilladores', alumno: 'Alumno 5', cantidad: 1 },
];
// --- FIN DE DATOS DE EJEMPLO ---

const SolicitudesPendientes = () => {
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [pendingLoans, setPendingLoans] = useState([]);
  const [users, setUsers] = useState([]);

  const filters = ["TODOS", "Redes", "Electrónica", "Mecánica"];

  // 🔹 Obtener todas las solicitudes pendientes
  const getPendingLoans = async () => {
    try {
      const data = await loansApi.getPendingLoans(); // <-- tu endpoint /loans/pending
      setPendingLoans(data);
    } catch (error) {
      console.error("Error al obtener préstamos pendientes:", error);
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

  const acceptLoan = async (id) => {
    try {
      const loan = await loansApi.acceptLoan(id);
      await getPendingLoans();
    } catch (error) {
      console.error("Error al aceptar loan:", error);
    }
  };

  // 🔹 Llamar a las APIs al cargar el componente
  useEffect(() => {
    getPendingLoans();
    getAllUsers();
  }, []);

  // 🔹 Combinar los datos de préstamos + usuarios
  const pendingRequests = pendingLoans.map((loan) => {
    const user = users.find((u) => u.id === loan.userId);
    return {
      id: loan.id,
      fecha: new Date(loan.startDate).toLocaleDateString(),
      herramienta: loan.Equipment?.name || "Desconocida",
      alumno: user ? user.email : "Desconocido",
      cantidad: loan.quantity || 1, // por si agregas el campo cantidad
    };
  });

  // 🔹 Aplicar filtro de tipo de herramienta
  const filteredRequests =
    activeFilter === "TODOS"
      ? pendingRequests
      : pendingRequests.filter(
          (r) => r.herramienta.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h2>Solicitudes Pendientes</h2>
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
              <th>Fecha Solicitud</th>
              <th>Herramienta</th>
              <th>Alumno (Email)</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.fecha}</td>
                <td>{request.herramienta}</td>
                <td>{request.alumno}</td>
                <td>{request.cantidad}</td>
                <td>
                  <a href="#" className="action-link-prestamo"
                    onClick={() => acceptLoan(request.id)}
                  >
                    Registrar Préstamo
                  </a>
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

export default SolicitudesPendientes;