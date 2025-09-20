import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Wrench, Eye } from 'lucide-react';
import axios from 'axios';
import ActivoFijoModal from '../components/ActivoFijoModal'; // Import the modal

const ActivosFijos = () => {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchActivos();
  }, []);

  const fetchActivos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activos-fijos');
      setActivos(response.data);
    } catch (error) {
      console.error('Error fetching activos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchActivos(); // Refresh the list after successful creation
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
      case 'Activo': return 'text-green-600 bg-green-100';
      case 'Vendido': return 'text-blue-600 bg-blue-100';
      case 'Dado de baja': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredActivos = activos.filter(activo =>
    activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activo.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Propiedad, Planta y Equipo</h1>
          <p className="mt-2 text-gray-600">Gestiona los activos fijos de la empresa</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} // Open modal on button click
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Activo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activos</p>
              <p className="text-2xl font-bold text-gray-900">{activos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(activos.reduce((sum, a) => sum + a.valor_adquisicion, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {activos.filter(a => a.estado === 'Activo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Wrench className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dados de Baja</p>
              <p className="text-2xl font-bold text-gray-900">
                {activos.filter(a => a.estado === 'Dado de baja').length}
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
                placeholder="Buscar activos..."
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
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Valor Adquisición</th>
                <th>Fecha Adquisición</th>
                <th>Vida Útil</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivos.map((activo) => (
                <tr key={activo.id}>
                  <td className="font-mono text-sm">{activo.codigo}</td>
                  <td className="font-medium">{activo.nombre}</td>
                  <td>{activo.categoria || '-'}</td>
                  <td className="font-semibold">{formatCurrency(activo.valor_adquisicion)}</td>
                  <td>
                    {activo.fecha_adquisicion 
                      ? new Date(activo.fecha_adquisicion).toLocaleDateString('es-MX')
                      : '-'
                    }
                  </td>
                  <td>{activo.vida_util_anos} años</td>
                  <td>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activo.estado)}`}>
                      {activo.estado}
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
      <ActivoFijoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ActivosFijos;
