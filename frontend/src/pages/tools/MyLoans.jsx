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

const MisPrestamos = ({masterLoanList, cancelLoan}) => {

  function formatLoan(loan) {
    const end = new Date(loan.endDate);
    const today = new Date();

    // Verificar si la devolución es hoy
    const isToday = end.toDateString() === today.toDateString();

    // Ej: "Hoy, 6:00 PM" o "16 de noviembre, 6:00 PM"
    const fechaDevolucion = isToday
      ? `Hoy, ${end.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`
      : `${end.getDate()} de ${end.toLocaleString('es-PE', {
          month: 'long'
        })}, ${end.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`;

    return {
      id: loan.id,
      nombre: loan.Equipment.name,
      fechaDevolucion
    };
  }

  const baseLoan = masterLoanList[0];
  const activeLoan = masterLoanList.length > 0 ? formatLoan(baseLoan) : null;

  return (
    <div>
      {/* --- 1. Préstamo Activo --- */}
      <div className="loan-section-container">
        <h2>
          Tu Préstamo
          {activeLoan ? (<>
            {baseLoan.status === "accepted" ? 
              " Activo" : " Pendiente"
            }
          </>) : (<></>)} 
        </h2>
        {activeLoan ? (
          <div className="active-loan-card">
            <h3>{activeLoan.nombre}</h3>
            {baseLoan.status === "accepted" ? 
            (<>
              <p className="active-return-time">Devolución: <strong>{activeLoan.fechaDevolucion}</strong></p>
              <button className="btn-return-now">Ver detalle</button>
            </>):(<>
              <p className="active-return-time">Tu solicitud fue enviada al docente encargado</p>
              <button className="btn-return-now" onClick={() => cancelLoan(activeLoan.id)}>Cancelar</button>
            </>)}  
          </div>
        ) : (
          <div className="no-booking-message"> {/* Reutilizamos esta clase */}
            <p>No tienes ningún préstamo activo.</p>
          </div>
        )}
      </div>

      {/* --- 2. Historial de Préstamos --- */}
      <div className="loan-section-container">
        <h2>Historial de Préstamos</h2>
        {loanHistory.length > 0 ? (
          <div className="booking-list"> {/* Reutilizamos esta clase */}
            {loanHistory.map((loan) => (
              <div className="booking-list-item" key={loan.id}> {/* Reutilizamos esta clase */}
                <div className="booking-item-info"> {/* Reutilizamos esta clase */}
                  <h4>{loan.nombre}</h4>
                  <p>
                    Prestado: {loan.fechaPrestamo} | Devuelto: {loan.fechaDevolucion}
                  </p>
                </div>
                <div className="booking-item-actions">
                  <button className="btn-reservar-again">Prestar de nuevo</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-booking-message"> {/* Reutilizamos esta clase */}
            <p>No tienes préstamos anteriores.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPrestamos;