import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Receipt, Eye } from 'lucide-react';
import axios from 'axios';
import ReciboModal from '../components/ReciboModal';

const Recibos = () => {
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecibos();
  }, []);

  const fetchRecibos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recibos');
      setRecibos(response.data);
    } catch (error) {
      console.error('Error fetching recibos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchRecibos(); // Refresh the list
    // Update sidebar counts
    if (window.updateSidebarCounts) {
      window.updateSidebarCounts();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const filteredRecibos = recibos.filter(recibo =>
    recibo.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recibo.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recibos</h1>
          <p className="mt-2 text-gray-600">Gestiona los recibos de cobro</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Recibo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recibos</p>
              <p className="text-2xl font-bold text-gray-900">{recibos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Receipt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cobrado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(recibos.reduce((sum, r) => sum + r.monto, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Receipt className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {recibos.length > 0 
                  ? formatCurrency(recibos.reduce((sum, r) => sum + r.monto, 0) / recibos.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar recibos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Concepto</th>
                <th>Método Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecibos.map((recibo) => (
                <tr key={recibo.id}>
                  <td className="font-mono text-sm">{recibo.folio}</td>
                  <td>
                    {recibo.fecha 
                      ? new Date(recibo.fecha).toLocaleDateString('es-MX')
                      : '-'
                    }
                  </td>
                  <td className="font-medium">{recibo.cliente_nombre || '-'}</td>
                  <td className="font-semibold text-green-600">{formatCurrency(recibo.monto)}</td>
                  <td>{recibo.concepto || '-'}</td>
                  <td>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {recibo.metodo_pago || 'Efectivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Ver">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Editar">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Eliminar">
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
      <ReciboModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Recibos;
