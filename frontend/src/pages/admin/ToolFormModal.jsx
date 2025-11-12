import React, { useState, useEffect } from 'react';

const ToolFormModal = ({ tool, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stockTotal: 0,
  });
  
  // --- NUEVO ESTADO PARA LA IMAGEN ---
  const [imagePreview, setImagePreview] = useState(null); // URL para la vista previa
  // En una app real, también guardarías el archivo: const [imageFile, setImageFile] = useState(null);

  const mode = tool ? 'edit' : 'create';

  useEffect(() => {
    if (mode === 'edit') {
      setFormData({
        nombre: tool.nombre,
        categoria: tool.categoria,
        stockTotal: tool.stockTotal,
      });
      // Cargar la imagen existente en la vista previa
      if (tool.imagenUrl) {
        setImagePreview(tool.imagenUrl);
      }
    }
  }, [tool, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stockTotal' ? parseInt(value) : value,
    }));
  };

  // --- NUEVA FUNCIÓN PARA MANEJAR EL ARCHIVO ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // En una app real: setImageFile(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // reader.result es un string base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pasamos la URL de la imagen (la de la vista previa) al guardar
    onSave({ ...formData, imagenUrl: imagePreview });
  };

  return (
    <div className="crud-modal-backdrop">
      <div className="crud-modal-content">
        <h2>{mode === 'edit' ? 'Editar Herramienta' : 'Añadir Herramienta'}</h2>
        
        <form onSubmit={handleSubmit} className="crud-form">
          {/* --- NUEVO CAMPO DE IMAGEN --- */}
          <div className="form-group">
            <label>Imagen de la Herramienta</label>
            <div className="image-previewer">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="image-preview" />
              ) : (
                <div className="image-placeholder">Sin Imagen</div>
              )}
            </div>
            <label className="file-input-label">
              Seleccionar archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-hidden"
              />
            </label>
          </div>
          {/* --- FIN CAMPO DE IMAGEN --- */}

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stockTotal">Stock Total</label>
            <input
              type="number"
              id="stockTotal"
              name="stockTotal"
              value={formData.stockTotal}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="crud-modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolFormModal;