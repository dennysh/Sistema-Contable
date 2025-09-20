import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ActivoFijoModal = ({ isOpen, onClose, onSuccess, editingActivo = null }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    valor_adquisicion: '',
    fecha_adquisicion: '',
    vida_util_anos: 5,
    valor_residual: 0,
    estado: 'Activo'
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (editingActivo) {
        setFormData({
          codigo: editingActivo.codigo || '',
          nombre: editingActivo.nombre || '',
          descripcion: editingActivo.descripcion || '',
          categoria: editingActivo.categoria || '',
          valor_adquisicion: editingActivo.valor_adquisicion || '',
          fecha_adquisicion: editingActivo.fecha_adquisicion || '',
          vida_util_anos: editingActivo.vida_util_anos || 5,
          valor_residual: editingActivo.valor_residual || 0,
          estado: editingActivo.estado || 'Activo'
        });
      } else {
        setFormData({
          codigo: '',
          nombre: '',
          descripcion: '',
          categoria: '',
          valor_adquisicion: '',
          fecha_adquisicion: '',
          vida_util_anos: 5,
          valor_residual: 0,
          estado: 'Activo'
        });
      }
    }
  }, [isOpen, editingActivo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        valor_adquisicion: parseFloat(formData.valor_adquisicion),
        valor_residual: parseFloat(formData.valor_residual),
        vida_util_anos: parseInt(formData.vida_util_anos)
      };

      if (editingActivo) {
        await axios.put(`http://localhost:5000/api/activos-fijos/${editingActivo.id}`, data);
        alert('Activo fijo actualizado exitosamente!');
      } else {
        await axios.post('http://localhost:5000/api/activos-fijos', data);
        alert('Activo fijo creado exitosamente!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving activo fijo:', error);
      alert('Error al guardar el activo fijo: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {editingActivo ? 'Editar Activo Fijo' : 'Nuevo Activo Fijo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="AF001"
              />
            </div>
            <div>
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Equipo de cómputo">Equipo de cómputo</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Vehículos">Vehículos</option>
                <option value="Maquinaria">Maquinaria</option>
                <option value="Equipo de oficina">Equipo de oficina</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Activo">Activo</option>
                <option value="Vendido">Vendido</option>
                <option value="Dado de baja">Dado de baja</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Valor de Adquisición *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="valor_adquisicion"
                value={formData.valor_adquisicion}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Fecha de Adquisición *</label>
              <input
                type="date"
                name="fecha_adquisicion"
                value={formData.fecha_adquisicion}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Vida Útil (años)</label>
              <input
                type="number"
                min="1"
                max="50"
                name="vida_util_anos"
                value={formData.vida_util_anos}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Valor Residual</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="valor_residual"
                value={formData.valor_residual}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (editingActivo ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivoFijoModal;
