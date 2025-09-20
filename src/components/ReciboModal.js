import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ReciboModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente_id: '',
    factura_venta_id: '',
    cuenta_bancaria_id: '',
    monto: '',
    concepto: '',
    metodo_pago: 'Efectivo'
  });
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
      fetchFacturas();
      fetchCuentas();
    }
  }, [isOpen]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/facturas-venta');
      setFacturas(response.data.filter(f => f.estado === 'Pendiente'));
    } catch (error) {
      console.error('Error fetching facturas:', error);
    }
  };

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cuentas-bancarias');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error fetching cuentas:', error);
    }
  };

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
        monto: parseFloat(formData.monto),
        factura_venta_id: formData.factura_venta_id || null
      };

      const response = await axios.post('http://localhost:5000/api/recibos', data);
      
      alert(`Recibo creado exitosamente!\nFolio: ${response.data.folio}`);
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        cliente_id: '',
        factura_venta_id: '',
        cuenta_bancaria_id: '',
        monto: '',
        concepto: '',
        metodo_pago: 'Efectivo'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating recibo:', error);
      alert('Error al crear el recibo: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Nuevo Recibo</h2>
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
              <label className="form-label">Cliente *</label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Factura de Venta (Opcional)</label>
              <select
                name="factura_venta_id"
                value={formData.factura_venta_id}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Sin factura específica</option>
                {facturas.map(factura => (
                  <option key={factura.id} value={factura.id}>
                    {factura.folio} - ${factura.total}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Cuenta Bancaria *</label>
              <select
                name="cuenta_bancaria_id"
                value={formData.cuenta_bancaria_id}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccionar cuenta</option>
                {cuentas.map(cuenta => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre} - {cuenta.banco}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Monto *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Método de Pago</label>
              <select
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Concepto</label>
            <textarea
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
              placeholder="Descripción del pago recibido"
            />
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

export default ReciboModal;
