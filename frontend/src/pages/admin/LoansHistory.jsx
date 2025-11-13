import { useEffect, useState } from 'react';
import loansApi from '../../api/loansApi';
import usersApi from '../../api/usersApi';
import './AdminLayout.css';
import { FaSearch } from 'react-icons/fa';

const HistorialPrestamos = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);

  // Obtener préstamos
  const getAllLoans = async () => {
    const data = await loansApi.getHistoryLoans();
    setLoans(data);
  };

  // Obtener usuarios
  const getAllUsers = async () => {
    const data = await usersApi.getUsers();
    setUsers(data);
  };

  // Llamar ambas APIs al cargar el componente
  useEffect(() => {
    getAllLoans();
    getAllUsers();
  }, []);


  if (loans.length === 0 || users.length === 0) {
    return <p>Cargando historial...</p>;
  }

  const StatusTag = ({ estado = '' }) => {
    const cleanEstado = estado.trim().toLowerCase();
    let className = 'status-tag';
    if (cleanEstado === 'devuelto' || cleanEstado === 'returned') className += ' completed';
    if (cleanEstado === 'con retraso' || cleanEstado === 'overdue') className += ' no-show';
    if (cleanEstado === 'prestado' || cleanEstado === 'loaned') className += ' loaned';
    if (cleanEstado === 'cancelado' || cleanEstado === 'cancelled') className += ' cancelled';

    return <span className={className}>{estado}</span>;
  };

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
                  <StatusTag estado={loan.estado} />
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