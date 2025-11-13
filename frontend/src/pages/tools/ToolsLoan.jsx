import { useState, useMemo } from 'react';
import { getUser } from '../../auth/auth';

const StatusTag = ({ status }) => {
  let className = 'status-tag';
  let text = '';

  switch (status) {
    case 'available':
    case 'disponible':
      className += ' status-disponible';
      text = 'Disponible';
      break;
    case 'loaned':
    case 'prestado':
      className += ' status-prestado';
      text = 'Prestado';
      break;
    case 'unavailable':
    case 'no-disp':
      className += ' status-no-disp';
      text = 'No Disp';
      break;
    default:
      text = 'N/A';
  }
  return <span className={className}>{text}</span>;
};

const toolImages = {
  1: '/dell.jpg',
  2: '/epson.jpg',
  3: '/router.jpg',
  4: '/hdmi.jpg',
};

const ReservarHerramienta = ({ masterToolList, loanTool, masterLoanList, setActiveTab }) => {

  const [filter, setFilter] = useState('todo'); // 'todo', 'disponible', 'prestado', 'no-disp'
  const [searchTerm, setSearchTerm] = useState('');

  const userId = getUser().id;

  // Lógica de filtrado y búsqueda
  const filteredTools = useMemo(() => {
    let tools = masterToolList;
    console.log(masterToolList)

    // 1. Filtrar por estado
    if (filter !== 'todo') {
      tools = tools.filter(tool => tool.status === filter);
    }

    // 2. Filtrar por búsqueda (en nombre o descripción)
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(lowerSearch) ||
        tool.description.toLowerCase().includes(lowerSearch)
      );
    }

    return tools;
  }, [filter, searchTerm]);

  const handleSubmit = async (toolId) => {
    const data = {equipmentId: toolId};
    await loanTool(data);
    setActiveTab("prestamos");
  }

  const hasActiveLoan = useMemo(() => {
    if (!masterLoanList) return false;
    return masterLoanList.some(
      loan => loan.userId === userId && (loan.status === 'pending' || loan.status === 'active')
    );
  }, [masterLoanList, userId]);

  return (
    <div>
      {/* --- Filtros y Búsqueda --- */}
      <div className="tool-filters-container">
        <div className="filter-buttons">
          <button
            className={`filter-btn todo ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            Todo
          </button>
          <button
            className={`filter-btn disponible ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Disponible
          </button>
          <button
            className={`filter-btn prestado ${filter === 'loaned' ? 'active' : ''}`}
            onClick={() => setFilter('loaned')}
          >
            Prestado
          </button>
          <button
            className={`filter-btn no-disp ${filter === 'unavailable' ? 'active' : ''}`}
            onClick={() => setFilter('unavailable')}
          >
            No Disp
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar Herramienta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Lista de Herramientas --- */}
      <div className="tool-list">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div className="tool-card" key={tool.id}>
              <img
                src={toolImages[tool.id] || '/images/tools/default.jpg'}
                alt={tool.name}
                className="tool-image"
              />
              <div className="tool-info">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              <div className="tool-status-action">
                <StatusTag status={tool.status} />
                <button
                  className={`btn-reservar ${hasActiveLoan ? 'disabled' : ''}`}
                  disabled={tool.status !== 'available' || hasActiveLoan}
                  onClick={() => handleSubmit(tool.id)}
                >
                  {hasActiveLoan
                    ? 'Ya tienes un préstamo'
                    : tool.status !== 'available'
                    ? 'No disponible'
                    : 'Reservar'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results-message">
            No se encontraron herramientas que coincidan con su búsqueda.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReservarHerramienta;