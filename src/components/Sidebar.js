import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCounts } from '../hooks/useCounts';
import { 
  Home, 
  Users, 
  Building2, 
  CreditCard, 
  Package, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  CreditCard as PaymentIcon,
  UserCheck,
  FileSpreadsheet,
  Wrench,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { counts, loading, refetch } = useCounts();

  // Expose refetch function to parent components
  useEffect(() => {
    window.updateSidebarCounts = refetch;
  }, [refetch]);

  const menuItems = [
    { path: '/', label: 'Resumen', icon: Home, count: null },
    { path: '/cuentas-bancarias', label: 'Cuentas de Efectivo y Bancos', icon: CreditCard, countKey: 'cuentas_bancarias' },
    { path: '/recibos', label: 'Recibos', icon: Receipt, countKey: 'recibos' },
    { path: '/pagos', label: 'Pagos', icon: PaymentIcon, countKey: 'pagos' },
    { path: '/clientes', label: 'Clientes', icon: Users, countKey: 'clientes' },
    { path: '/facturas-venta', label: 'Facturas de ventas', icon: FileText, countKey: 'facturas_venta' },
    { path: '/proveedores', label: 'Proveedores', icon: Building2, countKey: 'proveedores' },
    { path: '/facturas-compra', label: 'Facturas de compra', icon: ShoppingCart, countKey: 'facturas_compra' },
    { path: '/articulos', label: 'Artículos de inventario', icon: Package, countKey: 'articulos' },
    { path: '/empleados', label: 'Empleados', icon: UserCheck, countKey: 'empleados' },
    { path: '/recibos-nomina', label: 'Recibos de nómina', icon: FileSpreadsheet, countKey: 'recibos_nomina' },
    { path: '/activos-fijos', label: 'Propiedad, planta y equipo', icon: Wrench, countKey: 'activos_fijos' },
    { path: '/asientos-contables', label: 'Asientos de diario', icon: BookOpen, countKey: 'asientos_contables' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h2 className="text-xl font-bold text-white">Sistema Contable</h2>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.countKey && (
                      <span className={`
                        px-2 py-1 text-xs font-semibold rounded-full
                        ${isActive 
                          ? 'bg-primary-200 text-primary-800' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {loading ? '...' : (counts[item.countKey] || 0)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
