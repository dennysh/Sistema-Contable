import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, Eye } from 'lucide-react';
import axios from 'axios';
import AsientoContableModal from '../components/AsientoContableModal'; // Import the modal

const AsientosContables = () => {
  const [asientos, setAsientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchAsientos();
  }, []);

  const fetchAsientos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/asientos-contables');
      setAsientos(response.data);
    } catch (error) {
      console.error('Error fetching asientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchAsientos(); // Refresh the list after successful creation
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

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Aplicado': return 'text-green-600 bg-green-100';
      case 'Borrador': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAsientos = asientos.filter(asiento =>
    asiento.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asiento.concepto.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Asientos de Diario</h1>
          <p className="mt-2 text-gray-600">Gestiona los asientos contables</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} // Open modal on button click
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Asiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Asientos</p>
              <p className="text-2xl font-bold text-gray-900">{asientos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aplicados</p>
              <p className="text-2xl font-bold text-gray-900">
                {asientos.filter(a => a.estado === 'Aplicado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Borradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {asientos.filter(a => a.estado === 'Borrador').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <BookOpen className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">
                {asientos.filter(a => a.estado === 'Cancelado').length}
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
                placeholder="Buscar asientos..."
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
                <th>Concepto</th>
                <th>Total Debe</th>
                <th>Total Haber</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAsientos.map((asiento) => (
                <tr key={asiento.id}>
                  <td className="font-mono text-sm">{asiento.folio}</td>
                  <td>
                    {asiento.fecha 
                      ? new Date(asiento.fecha).toLocaleDateString('es-MX')
                      : '-'
                    }
                  </td>
                  <td className="font-medium">{asiento.concepto}</td>
                  <td className="font-semibold text-red-600">{formatCurrency(asiento.total_debe)}</td>
                  <td className="font-semibold text-green-600">{formatCurrency(asiento.total_haber)}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asiento.estado)}`}>
                      {asiento.estado}
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
      <AsientoContableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AsientosContables;
