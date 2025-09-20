import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const EmpleadoModal = ({ isOpen, onClose, onSuccess, editingEmpleado = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    rfc: '',
    curp: '',
    fecha_nacimiento: '',
    salario_diario: '',
    puesto: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (editingEmpleado) {
        setFormData({
          nombre: editingEmpleado.nombre || '',
          apellido_paterno: editingEmpleado.apellido_paterno || '',
          apellido_materno: editingEmpleado.apellido_materno || '',
          rfc: editingEmpleado.rfc || '',
          curp: editingEmpleado.curp || '',
          fecha_nacimiento: editingEmpleado.fecha_nacimiento || '',
          salario_diario: editingEmpleado.salario_diario || '',
          puesto: editingEmpleado.puesto || '',
          activo: editingEmpleado.activo !== undefined ? editingEmpleado.activo : true
        });
      } else {
        setFormData({
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          rfc: '',
          curp: '',
          fecha_nacimiento: '',
          salario_diario: '',
          puesto: '',
          activo: true
        });
      }
    }
  }, [isOpen, editingEmpleado]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        salario_diario: formData.salario_diario ? parseFloat(formData.salario_diario) : null,
        fecha_nacimiento: formData.fecha_nacimiento || null
      };

      if (editingEmpleado) {
        await axios.put(`http://localhost:5000/api/empleados/${editingEmpleado.id}`, data);
        alert('Empleado actualizado exitosamente!');
      } else {
        await axios.post('http://localhost:5000/api/empleados', data);
        alert('Empleado creado exitosamente!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving empleado:', error);
      alert('Error al guardar el empleado: ' + (error.response?.data?.error || error.message));
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
            {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="form-label">Apellido Paterno *</label>
              <input
                type="text"
                name="apellido_paterno"
                value={formData.apellido_paterno}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Apellido Materno</label>
              <input
                type="text"
                name="apellido_materno"
                value={formData.apellido_materno}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">RFC</label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleInputChange}
                className="form-input"
                maxLength="13"
              />
            </div>
            <div>
              <label className="form-label">CURP</label>
              <input
                type="text"
                name="curp"
                value={formData.curp}
                onChange={handleInputChange}
                className="form-input"
                maxLength="18"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Salario Diario</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="salario_diario"
                value={formData.salario_diario}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Puesto</label>
              <input
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Empleado Activo</span>
              </label>
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
              {loading ? 'Guardando...' : (editingEmpleado ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoModal;
