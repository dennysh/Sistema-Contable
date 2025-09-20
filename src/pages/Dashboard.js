import React, { useState, useEffect } from 'react';
import { useCounts } from '../hooks/useCounts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  Users,
  Package,
  FileText,
  Building2,
  Receipt,
  ShoppingCart,
  UserCheck,
  FileSpreadsheet,
  Wrench,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState(null);
  const { counts, loading: countsLoading } = useCounts();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/summary');
      setSummary(response.data);
    } catch (err) {
      setError('Error al cargar el resumen financiero');
      console.error('Error fetching summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, details = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6 card-hover transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      {details && (
        <div className="mt-4 space-y-2">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-medium text-blue-600 cursor-pointer hover:underline">
                {formatCurrency(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ModuleCard = ({ title, count, icon: Icon, path, color }) => (
    <a
      href={path}
      className="block bg-white rounded-lg shadow-md p-6 card-hover transition-all hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
        </div>
        <div className="text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );

  if (summaryLoading || countsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resumen General</h1>
        <p className="mt-2 text-gray-600">
          Vista general del estado financiero de la empresa
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado de situación financiera */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Estado de situación financiera</h2>
          
          <StatCard
            title="Activos"
            value={summary?.activos?.total || 0}
            icon={TrendingUp}
            color="text-green-600"
            details={summary?.activos?.detalle}
          />
          
          <StatCard
            title="Pasivos"
            value={summary?.pasivos?.total || 0}
            icon={TrendingDown}
            color="text-red-600"
            details={summary?.pasivos?.detalle}
          />
        </div>

        {/* Estado de Resultados */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Estado de Resultados</h2>
          
          <StatCard
            title="Ingresos"
            value={summary?.ingresos?.total || 0}
            icon={DollarSign}
            color="text-blue-600"
            details={summary?.ingresos?.detalle}
          />
          
          <StatCard
            title="Gastos"
            value={summary?.gastos?.total || 0}
            icon={CreditCard}
            color="text-orange-600"
            details={summary?.gastos?.detalle}
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="Cuentas de Efectivo y Bancos"
            count={counts.cuentas_bancarias || 0}
            icon={CreditCard}
            path="/cuentas-bancarias"
            color="bg-blue-500"
          />
          <ModuleCard
            title="Recibos"
            count={counts.recibos || 0}
            icon={Receipt}
            path="/recibos"
            color="bg-green-500"
          />
          <ModuleCard
            title="Pagos"
            count={counts.pagos || 0}
            icon={CreditCard}
            path="/pagos"
            color="bg-red-500"
          />
          <ModuleCard
            title="Clientes"
            count={counts.clientes || 0}
            icon={Users}
            path="/clientes"
            color="bg-purple-500"
          />
          <ModuleCard
            title="Facturas de ventas"
            count={counts.facturas_venta || 0}
            icon={FileText}
            path="/facturas-venta"
            color="bg-indigo-500"
          />
          <ModuleCard
            title="Proveedores"
            count={counts.proveedores || 0}
            icon={Building2}
            path="/proveedores"
            color="bg-yellow-500"
          />
          <ModuleCard
            title="Facturas de compra"
            count={counts.facturas_compra || 0}
            icon={ShoppingCart}
            path="/facturas-compra"
            color="bg-pink-500"
          />
          <ModuleCard
            title="Artículos de inventario"
            count={counts.articulos || 0}
            icon={Package}
            path="/articulos"
            color="bg-teal-500"
          />
          <ModuleCard
            title="Empleados"
            count={counts.empleados || 0}
            icon={UserCheck}
            path="/empleados"
            color="bg-orange-500"
          />
          <ModuleCard
            title="Recibos de nómina"
            count={counts.recibos_nomina || 0}
            icon={FileSpreadsheet}
            path="/recibos-nomina"
            color="bg-cyan-500"
          />
          <ModuleCard
            title="Propiedad, planta y equipo"
            count={counts.activos_fijos || 0}
            icon={Wrench}
            path="/activos-fijos"
            color="bg-gray-500"
          />
          <ModuleCard
            title="Asientos de diario"
            count={counts.asientos_contables || 0}
            icon={BookOpen}
            path="/asientos-contables"
            color="bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
