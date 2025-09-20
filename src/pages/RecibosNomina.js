import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FileSpreadsheet, Eye } from 'lucide-react';
import axios from 'axios';
import ReciboNominaModal from '../components/ReciboNominaModal'; // Import the modal

const RecibosNomina = () => {
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchRecibos();
  }, []);

  const fetchRecibos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recibos-nomina');
      setRecibos(response.data);
    } catch (error) {
      console.error('Error fetching recibos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchRecibos(); // Refresh the list after successful creation
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
    recibo.empleado_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Recibos de Nómina</h1>
          <p className="mt-2 text-gray-600">Gestiona los recibos de nómina de los empleados</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} // Open modal on button click
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Recibo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
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
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bruto</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(recibos.reduce((sum, r) => sum + r.total_bruto, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FileSpreadsheet className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Neto</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(recibos.reduce((sum, r) => sum + r.total_neto, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <FileSpreadsheet className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Neto</p>
              <p className="text-2xl font-bold text-gray-900">
                {recibos.length > 0 
                  ? formatCurrency(recibos.reduce((sum, r) => sum + r.total_neto, 0) / recibos.length)
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
                <th>Empleado</th>
                <th>Período</th>
                <th>Total Bruto</th>
                <th>Total Neto</th>
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
                  <td className="font-medium">{recibo.empleado_nombre || '-'}</td>
                  <td>
                    {recibo.periodo_inicio && recibo.periodo_fin
                      ? `${new Date(recibo.periodo_inicio).toLocaleDateString('es-MX')} - ${new Date(recibo.periodo_fin).toLocaleDateString('es-MX')}`
                      : '-'
                    }
                  </td>
                  <td className="font-semibold text-blue-600">{formatCurrency(recibo.total_bruto)}</td>
                  <td className="font-semibold text-green-600">{formatCurrency(recibo.total_neto)}</td>
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
      <ReciboNominaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RecibosNomina;
