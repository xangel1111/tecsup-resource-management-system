import React, { useState } from 'react';
import './AdminLayout.css'; // Reutiliza la misma hoja de estilos
import ToolFormModal from './ToolFormModal'; // Importamos el modal

// --- DATOS DE EJEMPLO ACTUALIZADOS ---
const initialToolsData = [
  { id: 1, nombre: 'Crimpadora', categoria: 'Redes', stockTotal: 10, stockDisponible: 5, imagenUrl: 'https://i.imgur.com/gSrxFfW.png' },
  { id: 2, nombre: 'Multímetro Digital', categoria: 'Electrónica', stockTotal: 5, stockDisponible: 2, imagenUrl: 'https://i.imgur.com/L8F4n8s.png' },
  { id: 3, nombre: 'Set de Destornilladores', categoria: 'General', stockTotal: 15, stockDisponible: 15, imagenUrl: 'https://i.imgur.com/O4hGqM6.png' },
  { id: 4, nombre: 'Switch 24 Puertos', categoria: 'Redes', stockTotal: 3, stockDisponible: 1, imagenUrl: 'https://i.imgur.com/gPj9tA2.png' },
];
// --- FIN DE DATOS DE EJEMPLO ---

const CrudHerramientas = () => {
  const [tools, setTools] = useState(initialToolsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  const handleOpenCreate = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDelete = (toolId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta herramienta?")) {
      setTools(tools.filter(t => t.id !== toolId));
      console.log("Eliminar:", toolId);
    }
  };

  const handleSave = (toolData) => {
    // La 'toolData' ahora incluye la 'imagenUrl' del modal
    if (editingTool) {
      // --- Lógica de ACTUALIZAR (Update) ---
      setTools(tools.map(t => (t.id === editingTool.id ? { ...t, ...toolData } : t)));
      console.log("Actualizar:", toolData);
    } else {
      // --- Lógica de CREAR (Create) ---
      const newTool = {
        id: Date.now(),
        stockDisponible: toolData.stockTotal,
        ...toolData, // Esto incluye nombre, categoria, stockTotal, e imagenUrl
      };
      setTools([...tools, newTool]);
      console.log("Crear:", newTool);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h2>Gestionar Herramientas</h2>
        <button className="btn-primary" onClick={handleOpenCreate}>
          Añadir Herramienta
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {/* --- NUEVA COLUMNA --- */}
              <th>Imagen</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock Total</th>
              <th>Stock Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(tool => (
              <tr key={tool.id}>
                {/* --- NUEVO CELDA DE IMAGEN --- */}
                <td>
                  <img
                    src={tool.imagenUrl || 'https://i.imgur.com/l1x9N1D.png'} // URL de placeholder
                    alt={tool.nombre}
                    className="table-tool-image"
                  />
                </td>
                <td>{tool.id}</td>
                <td>{tool.nombre}</td>
                <td>{tool.categoria}</td>
                <td>{tool.stockTotal}</td>
                <td>{tool.stockDisponible}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleOpenEdit(tool)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(tool.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ToolFormModal
          tool={editingTool}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CrudHerramientas;