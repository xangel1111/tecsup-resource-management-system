import { useEffect, useState } from 'react';
import loansApi from '../../api/loansApi';
import usersApi from '../../api/usersApi';
import './AdminLayout.css';
import { FaSearch } from 'react-icons/fa';
// --- DATOS DE EJEMPLO ---
const loanHistory = [
  { id: 1, fecha: '2025/10/04', herramienta: 'Crimpadora', alumno: 'Alumno 3', estado: 'Devuelto' },
  { id: 2, fecha: '2025/10/03', herramienta: 'Switch', alumno: 'Alumno 4', estado: 'Devuelto' },
  { id: 3, fecha: '2025/10/02', herramienta: 'Multímetro', alumno: 'Alumno 5', estado: 'Con Retraso' },
  { id: 4, fecha: '2025/10/01', herramienta: 'Set Destornilladores', alumno: 'Alumno 1', estado: 'Devuelto' },
];
// --- FIN DE DATOS DE EJEMPLO ---

// Componente para la etiqueta de estado
const StatusTag = ({ estado }) => {
  let className = 'status-tag';
  if (estado === 'Devuelto') className += ' completed'; // Reutiliza 'completed'
  if (estado === 'Con Retraso') className += ' no-show'; // Reutiliza 'no-show'
  
  return <span className={className}>{estado}</span>;
};

const HistorialPrestamos = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);

  // Obtener préstamos
  const getAllLoans = async () => {
    const data = await loansApi.getHistoryLoans();
    console.log(data)
    setLoans(data);
  };

  // Obtener usuarios
  const getAllUsers = async () => {
    const data = await usersApi.getUsers();
    console.log(data);
    setUsers(data);
  };

  // Llamar ambas APIs al cargar el componente
  useEffect(() => {
    getAllLoans();
    getAllUsers();
  }, []);

  // Unir los datos: loan + user.email
  const loanHistory = loans.map((loan) => {
    const user = users.find((u) => u.id === loan.userId);
    return {
      id: loan.id,
      fecha: new Date(loan.startDate).toLocaleDateString(),
      herramienta: loan.Equipment?.name || "Desconocida",
      alumno: user ? user.email : "Desconocido",
      estado: loan.status,
    };
  });

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h2>Historial de Préstamos</h2>
        <div className="history-filters">
          <input type="date" className="date-filter" />
          <div className="admin-search-bar small">
            <FaSearch />
            <input type="text" placeholder="Buscar por alumno o herramienta..." />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha Préstamo</th>
              <th>Herramienta</th>
              <th>Alumno (Email)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loanHistory.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.fecha}</td>
                <td>{loan.herramienta}</td>
                <td>{loan.alumno}</td>
                <td>
                  Prestamo Activo
                  {/*<StatusTag estado={loan.estado} />*/}
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

export default HistorialPrestamos;