# Sistema Contable Básico

Un sistema contable completo desarrollado con Python (Flask), MySQL y React, diseñado para ser fácil de usar y gestionar las operaciones financieras de pequeñas y medianas empresas.

## 🚀 Características Principales

### Dashboard Financiero
- **Resumen General**: Vista consolidada de Activos, Pasivos, Ingresos y Gastos
- **Tarjetas Visuales**: Información financiera presentada de forma clara y accesible
- **Módulos Integrados**: Acceso rápido a todas las funcionalidades del sistema
- **Contadores Dinámicos**: El menú lateral muestra la cantidad real de registros en cada módulo y se actualiza automáticamente

### Módulos Contables
- **Clientes**: Gestión completa de información de clientes
- **Proveedores**: Administración de proveedores y sus datos
- **Cuentas Bancarias**: Control de efectivo y cuentas bancarias
- **Inventario**: Gestión de artículos y control de stock
- **Facturas de Venta**: Emisión y seguimiento de facturas de venta
- **Facturas de Compra**: Registro de compras y facturas de proveedores
- **Recibos**: Control de cobros y recibos de pago
- **Pagos**: Gestión de pagos a proveedores
- **Empleados**: Administración de personal
- **Nómina**: Cálculo y emisión de recibos de nómina
- **Activos Fijos**: Control de propiedad, planta y equipo
- **Asientos Contables**: Registro de movimientos contables

### Características Técnicas
- **Interfaz Responsiva**: Diseño adaptable para dispositivos móviles y desktop
- **API RESTful**: Backend robusto con Flask y SQLAlchemy
- **Base de Datos MySQL**: Almacenamiento seguro y escalable
- **Interfaz Moderna**: Diseño limpio con Tailwind CSS
- **Navegación Intuitiva**: Sidebar con contadores dinámicos de registros
- **Contadores en Tiempo Real**: Los números del menú lateral se actualizan automáticamente al crear, editar o eliminar registros

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.8+**
- **Flask 2.3.3**: Framework web ligero
- **Flask-SQLAlchemy 3.0.5**: ORM para base de datos
- **PyMySQL 1.1.0**: Conector MySQL
- **Flask-CORS 4.0.0**: Manejo de CORS
- **marshmallow 3.20.1**: Serialización de datos

### Frontend
- **React 18.2.0**: Biblioteca de interfaz de usuario
- **React Router DOM 6.8.1**: Enrutamiento
- **Axios 1.3.4**: Cliente HTTP
- **Tailwind CSS 3.2.7**: Framework de CSS
- **Lucide React 0.263.1**: Iconos
- **Recharts 2.5.0**: Gráficos y visualizaciones

### Base de Datos
- **MySQL 8.0+**: Sistema de gestión de base de datos

## 📋 Requisitos Previos

Antes de instalar y ejecutar el sistema, asegúrate de tener instalado:

- **Python 3.8 o superior**
- **Node.js 16 o superior**
- **MySQL 8.0 o superior**
- **Git** (para clonar el repositorio)

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd sistema-contable
```

### 2. Configurar la Base de Datos

1. Crea una base de datos MySQL:
```sql
CREATE DATABASE sistema_contable;
```

2. Crea un archivo `.env` en la raíz del proyecto:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=sistema_contable

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=tu-clave-secreta-aqui
```

### 3. Configurar el Backend (Python)

1. Navega al directorio del proyecto:
```bash
cd sistema-contable
```

2. Crea un entorno virtual:
```bash
python -m venv venv
```

3. Activa el entorno virtual:
```bash
# En Windows
venv\Scripts\activate

# En macOS/Linux
source venv/bin/activate
```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

5. Ejecuta el servidor Flask:
```bash
python backend/app.py
```

El backend estará disponible en `http://localhost:5000`

### 4. Configurar el Frontend (React)

1. Abre una nueva terminal y navega al directorio del proyecto:
```bash
cd sistema-contable
```

2. Instala las dependencias de Node.js:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la Base de Datos

El sistema incluye las siguientes tablas principales:

### Entidades Principales
- **clientes**: Información de clientes
- **proveedores**: Datos de proveedores
- **cuentas_bancarias**: Cuentas de efectivo y bancos
- **articulos_inventario**: Catálogo de productos
- **empleados**: Información del personal

### Transacciones
- **facturas_venta**: Facturas de venta
- **detalles_factura_venta**: Detalles de productos en facturas de venta
- **facturas_compra**: Facturas de compra
- **detalles_factura_compra**: Detalles de productos en facturas de compra
- **recibos**: Recibos de cobro
- **pagos**: Pagos a proveedores
- **recibos_nomina**: Recibos de nómina

### Contabilidad
- **asientos_contables**: Asientos de diario
- **movimientos_contables**: Movimientos individuales de cada asiento
- **activos_fijos**: Propiedad, planta y equipo

## 🚀 Uso del Sistema

### 1. Acceso al Sistema
- Abre tu navegador y ve a `http://localhost:3000`
- El sistema mostrará el dashboard principal con el resumen financiero

### 2. Navegación
- Utiliza el menú lateral para acceder a los diferentes módulos
- Cada módulo muestra contadores de registros para referencia rápida

### 3. Gestión de Datos
- **Crear**: Utiliza el botón "Nuevo" en cada módulo
- **Editar**: Haz clic en el ícono de edición en las tablas
- **Eliminar**: Usa el ícono de eliminación (con confirmación)
- **Buscar**: Utiliza la barra de búsqueda en cada módulo

### 4. Flujo Contable Básico
1. **Configuración Inicial**:
   - Registra clientes y proveedores
   - Configura cuentas bancarias
   - Crea artículos de inventario
   - Registra empleados

2. **Operaciones Diarias**:
   - Emite facturas de venta
   - Registra facturas de compra
   - Procesa recibos de cobro
   - Realiza pagos a proveedores

3. **Contabilidad**:
   - Registra asientos contables
   - Genera recibos de nómina
   - Actualiza inventarios

## 📊 Reportes Financieros

El sistema genera automáticamente:

### Dashboard Principal
- **Estado de Situación Financiera**:
  - Activos (Cuentas por cobrar, Efectivo, Inventario, Activos fijos)
  - Pasivos (Cuentas por pagar, Impuestos a pagar)

- **Estado de Resultados**:
  - Ingresos (Ventas, Intereses)
  - Gastos (Gastos operativos, Publicidad, etc.)

### Módulos con Reportes
- Resúmenes por módulo con totales y estadísticas
- Filtros y búsquedas en tiempo real
- Exportación de datos (funcionalidad futura)

## 📈 Contadores Dinámicos

El sistema incluye una funcionalidad avanzada de contadores dinámicos en el menú lateral:

### Características
- **Contadores en Tiempo Real**: Los números del menú lateral y Dashboard reflejan la cantidad real de registros en cada módulo
- **Actualización Automática**: Los contadores se actualizan automáticamente al crear, editar o eliminar registros
- **Sin Recarga de Página**: Los cambios se reflejan instantáneamente sin necesidad de recargar la página
- **Sincronización Completa**: Los contadores del Dashboard y Sidebar se mantienen perfectamente sincronizados
- **API Dedicada**: Endpoint `/api/counts` que devuelve el conteo de todos los módulos

### Módulos con Contadores
- Clientes
- Proveedores  
- Cuentas Bancarias
- Artículos de Inventario
- Facturas de Venta
- Facturas de Compra
- Recibos
- Pagos
- Empleados
- Recibos de Nómina
- Activos Fijos
- Asientos Contables

### Implementación Técnica
- **Backend**: Endpoint RESTful que consulta la base de datos
- **Frontend**: React hooks personalizados para manejo de estado y actualizaciones
- **Comunicación**: Sistema de eventos personalizados para sincronización entre componentes
- **Sincronización**: Los contadores del Dashboard y Sidebar se mantienen sincronizados automáticamente
- **Hook Personalizado**: `useCounts()` para reutilización en múltiples componentes

## 🔒 Seguridad

- Validación de datos en frontend y backend
- Sanitización de entradas de usuario
- Protección contra inyección SQL con SQLAlchemy
- Manejo seguro de errores

## 🚀 Despliegue

### Despliegue Local
El sistema está configurado para ejecutarse localmente con:
- Backend en puerto 5000
- Frontend en puerto 3000
- Base de datos MySQL en puerto 3306

### Despliegue en Producción
Para desplegar en producción:

1. **Backend**:
   - Usa un servidor WSGI como Gunicorn
   - Configura un servidor web como Nginx
   - Usa una base de datos MySQL en la nube

2. **Frontend**:
   - Ejecuta `npm run build` para crear la versión de producción
   - Sirve los archivos estáticos con un servidor web

3. **Base de Datos**:
   - Configura MySQL en un servidor dedicado
   - Implementa respaldos automáticos
   - Configura replicación si es necesario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔮 Próximas Características

- [ ] Reportes PDF exportables
- [ ] Gráficos y visualizaciones avanzadas
- [ ] Sistema de usuarios y permisos
- [ ] Integración con APIs de bancos
- [ ] Notificaciones por email
- [ ] Aplicación móvil
- [ ] Backup automático de base de datos
- [ ] Auditoría de cambios

## 📞 Contacto

Para más información sobre el proyecto, contacta a:
- Email: [tu-email@ejemplo.com]
- GitHub: [tu-usuario-github]

---

**Desarrollado por**: Dennys Heras, Darky Gonzalez

**Nota**: Este es un sistema de demostración. Para uso en producción, se recomienda implementar medidas de seguridad adicionales y realizar pruebas exhaustivas.
