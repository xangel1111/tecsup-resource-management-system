// --- DATOS DE EJEMPLO ---
const FAKactiveLoan = {
  id: 1,
  nombre: 'Crimpadora',
  fechaDevolucion: 'Hoy, 6:00 PM',
};
// const activeLoan = null; // Prueba el estado vacío

const loanHistory = [
  {
    id: 2,
    nombre: 'Switch',
    fechaPrestamo: '2025-11-05',
    fechaDevolucion: '2025-11-07',
  },
  {
    id: 3,
    nombre: 'Multímetro Digital',
    fechaPrestamo: '2025-11-01',
    fechaDevolucion: '2025-11-03',
  },
];

import { getUser } from '../../auth/auth'; // Asegúrate de importar esto

const MisPrestamos = ({ masterLoanList, cancelLoan }) => {
  const userId = getUser().id;

  // 🔹 Filtrar solo los préstamos del usuario autenticado
  const userLoans = masterLoanList.filter((loan) => loan.userId === userId);

  // 🔹 Formatear los datos de préstamo
  function formatLoan(loan) {
    const end = new Date(loan.endDate);
    const today = new Date();

    const isToday = end.toDateString() === today.toDateString();

    const fechaDevolucion = isToday
      ? `Hoy, ${end.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`
      : `${end.getDate()} de ${end.toLocaleString('es-PE', {
          month: 'long',
        })}, ${end.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`;

    return {
      id: loan.id,
      nombre: loan.Equipment.name,
      fechaDevolucion,
      fechaPrestamo: new Date(loan.startDate).toLocaleDateString('es-PE'),
      status: loan.status,
    };
  }

  // 🔹 Determinar préstamo activo (pending o accepted)
  const activeBaseLoan = userLoans.find((loan) =>
    ['pending', 'accepted'].includes(loan.status)
  );
  const activeLoan = activeBaseLoan ? formatLoan(activeBaseLoan) : null;

  // 🔹 Historial de préstamos (los que ya finalizaron)
  /*
  const loanHistory = userLoans
    .filter((loan) => loan.status === 'returned' || loan.status === 'rejected')
    .map(formatLoan);
  */

  return (
    <div>
      {/* --- 1. Préstamo Activo --- */}
      <div className="loan-section-container">
        <h2>
          Tu Préstamo
          {activeLoan ? (
            <>
              {activeBaseLoan.status === 'accepted'
                ? ' Activo'
                : ' Pendiente'}
            </>
          ) : null}
        </h2>

        {activeLoan ? (
          <div className="active-loan-card">
            <h3>{activeLoan.nombre}</h3>
            {activeBaseLoan.status === 'accepted' ? (
              <>
                <p className="active-return-time">
                  Devolución: <strong>{activeLoan.fechaDevolucion}</strong>
                </p>
                <button className="btn-return-now">Ver detalle</button>
              </>
            ) : (
              <>
                <p className="active-return-time">
                  Tu solicitud fue enviada al docente encargado
                </p>
                <button
                  className="btn-return-now"
                  onClick={() => cancelLoan(activeLoan.id)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="no-booking-message">
            <p>No tienes ningún préstamo activo.</p>
          </div>
        )}
      </div>

      {/* --- 2. Historial de Préstamos --- */}
      <div className="loan-section-container">
        <h2>Historial de Préstamos</h2>
        {loanHistory.length > 0 ? (
          <div className="booking-list">
            {loanHistory.map((loan) => (
              <div className="booking-list-item" key={loan.id}>
                <div className="booking-item-info">
                  <h4>{loan.nombre}</h4>
                  <p>
                    Prestado: {loan.fechaPrestamo} | Devuelto:{' '}
                    {loan.fechaDevolucion}
                  </p>
                </div>
                <div className="booking-item-actions">
                  <button className="btn-reservar-again">
                    Prestar de nuevo
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-booking-message">
            <p>No tienes préstamos anteriores.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPrestamos;
