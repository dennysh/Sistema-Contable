import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react';
import axios from 'axios';

const CuentasBancarias = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    banco: '',
    numero_cuenta: '',
    saldo_inicial: ''
  });

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cuentas-bancarias');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error fetching cuentas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCuenta) {
        await axios.put(`http://localhost:5000/api/cuentas-bancarias/${editingCuenta.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/cuentas-bancarias', formData);
      }
      fetchCuentas();
      setShowModal(false);
      setEditingCuenta(null);
      setFormData({ nombre: '', banco: '', numero_cuenta: '', saldo_inicial: '' });
    } catch (error) {
      console.error('Error saving cuenta:', error);
    }
  };

  const handleEdit = (cuenta) => {
    setEditingCuenta(cuenta);
    setFormData({
      nombre: cuenta.nombre,
      banco: cuenta.banco,
      numero_cuenta: cuenta.numero_cuenta,
      saldo_inicial: cuenta.saldo_actual.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta bancaria?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cuentas-bancarias/${id}`);
        fetchCuentas();
      } catch (error) {
        console.error('Error deleting cuenta:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const filteredCuentas = cuentas.filter(cuenta =>
    cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuenta.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuenta.numero_cuenta.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cuentas de Efectivo y Bancos</h1>
          <p className="mt-2 text-gray-600">Gestiona las cuentas bancarias y efectivo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Cuenta
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cuentas</p>
              <p className="text-2xl font-bold text-gray-900">{cuentas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cuentas.reduce((sum, cuenta) => sum + cuenta.saldo_actual, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Cuenta</p>
              <p className="text-2xl font-bold text-gray-900">
                {cuentas.length > 0 
                  ? formatCurrency(cuentas.reduce((sum, cuenta) => sum + cuenta.saldo_actual, 0) / cuentas.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar cuentas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Banco</th>
                <th>Número de Cuenta</th>
                <th>Saldo Actual</th>
                <th>Fecha Apertura</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCuentas.map((cuenta) => (
                <tr key={cuenta.id}>
                  <td className="font-medium">{cuenta.nombre}</td>
                  <td>{cuenta.banco}</td>
                  <td className="font-mono text-sm">{cuenta.numero_cuenta}</td>
                  <td className="font-semibold">
                    <span className={cuenta.saldo_actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(cuenta.saldo_actual)}
                    </span>
                  </td>
                  <td>
                    {cuenta.fecha_apertura 
                      ? new Date(cuenta.fecha_apertura).toLocaleDateString('es-MX')
                      : '-'
                    }
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cuenta)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cuenta.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre de la Cuenta *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="form-input"
                  placeholder="Ej: Cuenta Principal"
                />
              </div>
              <div>
                <label className="form-label">Banco *</label>
                <input
                  type="text"
                  required
                  value={formData.banco}
                  onChange={(e) => setFormData({...formData, banco: e.target.value})}
                  className="form-input"
                  placeholder="Ej: BBVA, Santander, etc."
                />
              </div>
              <div>
                <label className="form-label">Número de Cuenta *</label>
                <input
                  type="text"
                  required
                  value={formData.numero_cuenta}
                  onChange={(e) => setFormData({...formData, numero_cuenta: e.target.value})}
                  className="form-input"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="form-label">Saldo Inicial</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.saldo_inicial}
                  onChange={(e) => setFormData({...formData, saldo_inicial: e.target.value})}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCuenta(null);
                    setFormData({ nombre: '', banco: '', numero_cuenta: '', saldo_inicial: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCuenta ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuentasBancarias;
