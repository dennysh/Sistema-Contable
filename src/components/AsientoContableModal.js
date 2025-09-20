import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const AsientoContableModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    estado: 'Borrador'
  });
  const [movimientos, setMovimientos] = useState([
    { cuenta: '', debe: 0, haber: 0, concepto: '' }
  ]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        estado: 'Borrador'
      });
      setMovimientos([{ cuenta: '', debe: 0, haber: 0, concepto: '' }]);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMovimientoChange = (index, field, value) => {
    const newMovimientos = [...movimientos];
    newMovimientos[index][field] = field === 'cuenta' || field === 'concepto' ? value : parseFloat(value) || 0;
    setMovimientos(newMovimientos);
  };

  const addMovimiento = () => {
    setMovimientos([...movimientos, { cuenta: '', debe: 0, haber: 0, concepto: '' }]);
  };

  const removeMovimiento = (index) => {
    if (movimientos.length > 1) {
      setMovimientos(movimientos.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const total_debe = movimientos.reduce((sum, mov) => sum + (mov.debe || 0), 0);
    const total_haber = movimientos.reduce((sum, mov) => sum + (mov.haber || 0), 0);
    return { total_debe, total_haber };
  };

  const isBalanced = () => {
    const { total_debe, total_haber } = calculateTotals();
    return Math.abs(total_debe - total_haber) < 0.01; // Allow for small floating point differences
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isBalanced()) {
        alert('El asiento no está balanceado. El total del debe debe ser igual al total del haber.');
        setLoading(false);
        return;
      }

      const { total_debe, total_haber } = calculateTotals();
      
      const data = {
        ...formData,
        movimientos: movimientos.map(mov => ({
          cuenta: mov.cuenta,
          debe: mov.debe,
          haber: mov.haber,
          concepto: mov.concepto
        }))
      };

      const response = await axios.post('http://localhost:5000/api/asientos-contables', data);
      
      alert(`Asiento contable creado exitosamente!\nFolio: ${response.data.folio}`);
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        estado: 'Borrador'
      });
      setMovimientos([{ cuenta: '', debe: 0, haber: 0, concepto: '' }]);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating asiento:', error);
      alert('Error al crear el asiento contable: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const { total_debe, total_haber } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Nuevo Asiento Contable</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="form-label">Concepto *</label>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Descripción del asiento"
              />
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Borrador">Borrador</option>
                <option value="Aplicado">Aplicado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Movimientos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Movimientos Contables</h3>
              <button
                type="button"
                onClick={addMovimiento}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Movimiento
              </button>
            </div>

            <div className="space-y-4">
              {movimientos.map((movimiento, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="form-label">Cuenta *</label>
                    <input
                      type="text"
                      value={movimiento.cuenta}
                      onChange={(e) => handleMovimientoChange(index, 'cuenta', e.target.value)}
                      className="form-input"
                      required
                      placeholder="Ej: Bancos, Ventas, etc."
                    />
                  </div>
                  <div>
                    <label className="form-label">Debe</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={movimiento.debe}
                      onChange={(e) => handleMovimientoChange(index, 'debe', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Haber</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={movimiento.haber}
                      onChange={(e) => handleMovimientoChange(index, 'haber', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeMovimiento(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                      disabled={movimientos.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Total Debe</label>
                <input
                  type="number"
                  value={total_debe.toFixed(2)}
                  className={`form-input bg-gray-100 font-semibold ${!isBalanced() ? 'border-red-500' : ''}`}
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Total Haber</label>
                <input
                  type="number"
                  value={total_haber.toFixed(2)}
                  className={`form-input bg-gray-100 font-semibold ${!isBalanced() ? 'border-red-500' : ''}`}
                  readOnly
                />
              </div>
            </div>
            {!isBalanced() && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ El asiento no está balanceado. La diferencia es: ${Math.abs(total_debe - total_haber).toFixed(2)}
              </p>
            )}
          </div>

          {/* Actions */}
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
              disabled={loading || !isBalanced()}
            >
              {loading ? 'Creando...' : 'Crear Asiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsientoContableModal;
