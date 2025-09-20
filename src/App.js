import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Proveedores from './pages/Proveedores';
import CuentasBancarias from './pages/CuentasBancarias';
import Articulos from './pages/Articulos';
import FacturasVenta from './pages/FacturasVenta';
import FacturasCompra from './pages/FacturasCompra';
import Recibos from './pages/Recibos';
import Pagos from './pages/Pagos';
import Empleados from './pages/Empleados';
import RecibosNomina from './pages/RecibosNomina';
import ActivosFijos from './pages/ActivosFijos';
import AsientosContables from './pages/AsientosContables';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Sistema Contable</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Realizado por Dennys Heras, Darky Gonzalez</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/cuentas-bancarias" element={<CuentasBancarias />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/facturas-venta" element={<FacturasVenta />} />
                <Route path="/facturas-compra" element={<FacturasCompra />} />
                <Route path="/recibos" element={<Recibos />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/recibos-nomina" element={<RecibosNomina />} />
                <Route path="/activos-fijos" element={<ActivosFijos />} />
                <Route path="/asientos-contables" element={<AsientosContables />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
