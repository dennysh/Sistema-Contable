import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const PagoModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proveedor_id: '',
    factura_compra_id: '',
    cuenta_bancaria_id: '',
    monto: '',
    concepto: '',
    metodo_pago: 'Efectivo'
  });
  const [proveedores, setProveedores] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProveedores();
      fetchFacturas();
      fetchCuentas();
    }
  }, [isOpen]);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/facturas-compra');
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
        factura_compra_id: formData.factura_compra_id || null
      };

      const response = await axios.post('http://localhost:5000/api/pagos', data);
      
      alert(`Pago creado exitosamente!\nFolio: ${response.data.folio}`);
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        proveedor_id: '',
        factura_compra_id: '',
        cuenta_bancaria_id: '',
        monto: '',
        concepto: '',
        metodo_pago: 'Efectivo'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating pago:', error);
      alert('Error al crear el pago: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Nuevo Pago</h2>
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
              <label className="form-label">Proveedor *</label>
              <select
                name="proveedor_id"
                value={formData.proveedor_id}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Factura de Compra (Opcional)</label>
              <select
                name="factura_compra_id"
                value={formData.factura_compra_id}
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
              placeholder="Descripción del pago realizado"
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
              {loading ? 'Creando...' : 'Crear Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PagoModal;
