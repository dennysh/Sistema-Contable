import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ReciboNominaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    empleado_id: '',
    periodo_inicio: '',
    periodo_fin: '',
    salario_base: '',
    horas_extra: 0,
    bonos: 0,
    deducciones: 0
  });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmpleados();
      // Set default period (current month)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFormData(prev => ({
        ...prev,
        periodo_inicio: firstDay.toISOString().split('T')[0],
        periodo_fin: lastDay.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/empleados');
      setEmpleados(response.data.filter(e => e.activo));
    } catch (error) {
      console.error('Error fetching empleados:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    const salario_base = parseFloat(formData.salario_base) || 0;
    const horas_extra = parseFloat(formData.horas_extra) || 0;
    const bonos = parseFloat(formData.bonos) || 0;
    const deducciones = parseFloat(formData.deducciones) || 0;
    
    const total_bruto = salario_base + (horas_extra * salario_base / 8) + bonos;
    const total_neto = total_bruto - deducciones;
    
    return { total_bruto, total_neto };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { total_bruto, total_neto } = calculateTotals();
      
      const data = {
        ...formData,
        salario_base: parseFloat(formData.salario_base),
        horas_extra: parseFloat(formData.horas_extra),
        bonos: parseFloat(formData.bonos),
        deducciones: parseFloat(formData.deducciones),
        total_bruto,
        total_neto
      };

      const response = await axios.post('http://localhost:5000/api/recibos-nomina', data);
      
      alert(`Recibo de nómina creado exitosamente!\nFolio: ${response.data.folio}`);
      
      // Reset form
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        empleado_id: '',
        periodo_inicio: firstDay.toISOString().split('T')[0],
        periodo_fin: lastDay.toISOString().split('T')[0],
        salario_base: '',
        horas_extra: 0,
        bonos: 0,
        deducciones: 0
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating recibo nomina:', error);
      alert('Error al crear el recibo de nómina: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const { total_bruto, total_neto } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Nuevo Recibo de Nómina</h2>
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
              <label className="form-label">Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Empleado *</label>
              <select
                name="empleado_id"
                value={formData.empleado_id}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map(empleado => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno || ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Período Inicio *</label>
              <input
                type="date"
                name="periodo_inicio"
                value={formData.periodo_inicio}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Período Fin *</label>
              <input
                type="date"
                name="periodo_fin"
                value={formData.periodo_fin}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Salario Base *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="salario_base"
                value={formData.salario_base}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Horas Extra</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="horas_extra"
                value={formData.horas_extra}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Bonos</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="bonos"
                value={formData.bonos}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Deducciones</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="deducciones"
                value={formData.deducciones}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Calculated Totals */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Total Bruto</label>
                <input
                  type="number"
                  value={total_bruto.toFixed(2)}
                  className="form-input bg-gray-100 font-semibold"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Total Neto</label>
                <input
                  type="number"
                  value={total_neto.toFixed(2)}
                  className="form-input bg-gray-100 font-bold text-green-600"
                  readOnly
                />
              </div>
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
              {loading ? 'Creando...' : 'Crear Recibo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReciboNominaModal;
