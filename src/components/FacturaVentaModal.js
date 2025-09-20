import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const FacturaVentaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente_id: '',
    estado: 'Pendiente'
  });
  const [detalles, setDetalles] = useState([{ articulo_id: '', cantidad: 1, precio_unitario: 0 }]);
  const [clientes, setClientes] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
      fetchArticulos();
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

  const fetchArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error('Error fetching articulos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetalleChange = (index, field, value) => {
    const newDetalles = [...detalles];
    newDetalles[index][field] = value;
    
    // Recalculate subtotal
    if (field === 'cantidad' || field === 'precio_unitario') {
      newDetalles[index].subtotal = newDetalles[index].cantidad * newDetalles[index].precio_unitario;
    }
    
    setDetalles(newDetalles);
  };

  const addDetalle = () => {
    setDetalles([...detalles, { articulo_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]);
  };

  const removeDetalle = (index) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = detalles.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0);
    const iva = subtotal * 0.15;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { subtotal, iva, total } = calculateTotals();
      
      const data = {
        ...formData,
        detalles: detalles.map(detalle => ({
          articulo_id: parseInt(detalle.articulo_id),
          cantidad: parseInt(detalle.cantidad),
          precio_unitario: parseFloat(detalle.precio_unitario)
        }))
      };

      const response = await axios.post('http://localhost:5000/api/facturas-venta', data);
      
      alert(`Factura creada exitosamente!\nFolio: ${response.data.folio}\nAsiento ID: ${response.data.asiento_id}`);
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        cliente_id: '',
        estado: 'Pendiente'
      });
      setDetalles([{ articulo_id: '', cantidad: 1, precio_unitario: 0 }]);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating factura:', error);
      alert('Error al crear la factura: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, iva, total } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Nueva Factura de Venta</h2>
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
            <div>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Detalles */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalles de la Factura</h3>
              <button
                type="button"
                onClick={addDetalle}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </button>
            </div>

            <div className="space-y-4">
              {detalles.map((detalle, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="form-label">Artículo</label>
                    <select
                      value={detalle.articulo_id}
                      onChange={(e) => {
                        const articulo = articulos.find(a => a.id === parseInt(e.target.value));
                        handleDetalleChange(index, 'articulo_id', e.target.value);
                        if (articulo) {
                          handleDetalleChange(index, 'precio_unitario', articulo.precio_venta || 0);
                        }
                      }}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar artículo</option>
                      {articulos.map(articulo => (
                        <option key={articulo.id} value={articulo.id}>
                          {articulo.nombre} - ${articulo.precio_venta || 0}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={detalle.cantidad}
                      onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Precio Unitario</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={detalle.precio_unitario}
                      onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Subtotal</label>
                    <input
                      type="number"
                      value={detalle.subtotal || 0}
                      className="form-input bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeDetalle(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                      disabled={detalles.length === 1}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Subtotal</label>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                  className="form-input bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">IVA (15%)</label>
                <input
                  type="number"
                  value={iva.toFixed(2)}
                  className="form-input bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Total</label>
                <input
                  type="number"
                  value={total.toFixed(2)}
                  className="form-input bg-gray-100 font-bold"
                  readOnly
                />
              </div>
            </div>
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
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Factura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacturaVentaModal;
