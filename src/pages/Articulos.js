import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import axios from 'axios';

const Articulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: '',
    unidad_medida: 'PZA'
  });

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error('Error fetching articulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticulo) {
        await axios.put(`http://localhost:5000/api/articulos/${editingArticulo.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/articulos', formData);
      }
      fetchArticulos();
      setShowModal(false);
      setEditingArticulo(null);
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio_compra: '',
        precio_venta: '',
        stock_actual: '',
        stock_minimo: '',
        unidad_medida: 'PZA'
      });
    } catch (error) {
      console.error('Error saving articulo:', error);
    }
  };

  const handleEdit = (articulo) => {
    setEditingArticulo(articulo);
    setFormData({
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion || '',
      precio_compra: articulo.precio_compra?.toString() || '',
      precio_venta: articulo.precio_venta?.toString() || '',
      stock_actual: articulo.stock_actual.toString(),
      stock_minimo: articulo.stock_minimo.toString(),
      unidad_medida: articulo.unidad_medida
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/articulos/${id}`);
        fetchArticulos();
      } catch (error) {
        console.error('Error deleting articulo:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const filteredArticulos = articulos.filter(articulo =>
    articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articulo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Artículos de Inventario</h1>
          <p className="mt-2 text-gray-600">Gestiona el inventario de productos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Artículo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Artículos</p>
              <p className="text-2xl font-bold text-gray-900">{articulos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(articulos.reduce((sum, art) => sum + (art.stock_actual * (art.precio_compra || 0)), 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">
                {articulos.filter(art => art.stock_actual <= art.stock_minimo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Package className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {articulos.filter(art => art.stock_actual === 0).length}
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
                placeholder="Buscar artículos..."
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
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Stock</th>
                <th>Stock Mín.</th>
                <th>Valor Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticulos.map((articulo) => (
                <tr key={articulo.id}>
                  <td className="font-mono text-sm">{articulo.codigo}</td>
                  <td className="font-medium">{articulo.nombre}</td>
                  <td>{articulo.precio_compra ? formatCurrency(articulo.precio_compra) : '-'}</td>
                  <td>{articulo.precio_venta ? formatCurrency(articulo.precio_venta) : '-'}</td>
                  <td>
                    <span className={articulo.stock_actual <= articulo.stock_minimo ? 'text-red-600 font-semibold' : ''}>
                      {articulo.stock_actual} {articulo.unidad_medida}
                    </span>
                  </td>
                  <td>{articulo.stock_minimo} {articulo.unidad_medida}</td>
                  <td className="font-semibold">
                    {formatCurrency(articulo.stock_actual * (articulo.precio_compra || 0))}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(articulo)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(articulo.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Código *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    className="form-input"
                    placeholder="ART001"
                  />
                </div>
                <div>
                  <label className="form-label">Unidad de Medida</label>
                  <select
                    value={formData.unidad_medida}
                    onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})}
                    className="form-input"
                  >
                    <option value="PZA">Pieza</option>
                    <option value="KG">Kilogramo</option>
                    <option value="L">Litro</option>
                    <option value="M">Metro</option>
                    <option value="M2">Metro Cuadrado</option>
                    <option value="M3">Metro Cúbico</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="form-input"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Descripción detallada del producto"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Precio de Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_compra}
                    onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="form-label">Precio de Venta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_venta}
                    onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Stock Actual</label>
                  <input
                    type="number"
                    value={formData.stock_actual}
                    onChange={(e) => setFormData({...formData, stock_actual: e.target.value})}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="form-label">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                    className="form-input"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingArticulo(null);
                    setFormData({
                      codigo: '',
                      nombre: '',
                      descripcion: '',
                      precio_compra: '',
                      precio_venta: '',
                      stock_actual: '',
                      stock_minimo: '',
                      unidad_medida: 'PZA'
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingArticulo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articulos;
