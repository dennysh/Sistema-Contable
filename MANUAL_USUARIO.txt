# Manual de Usuario - Sistema Contable

## 📋 Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Dashboard Principal](#dashboard-principal)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Flujo de Trabajo Contable](#flujo-de-trabajo-contable)
6. [Guías Paso a Paso](#guías-paso-a-paso)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Introducción

El **Sistema Contable** es una aplicación web completa diseñada para la gestión financiera y contable de pequeñas y medianas empresas. Permite administrar clientes, proveedores, inventario, facturación, nómina y todos los aspectos contables necesarios.

### Características Principales
- ✅ **Dashboard financiero** con resumen en tiempo real
- ✅ **12 módulos integrados** para gestión completa
- ✅ **Contadores dinámicos** que se actualizan automáticamente
- ✅ **Generación automática** de asientos contables
- ✅ **Interfaz responsiva** para móviles y desktop
- ✅ **Cálculo automático** de IVA al 15%

---

## 🌐 Acceso al Sistema

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para la aplicación web)

### Iniciar el Sistema
1. **Abrir el navegador** y dirigirse a: `http://localhost:3000`
2. **El sistema se cargará automáticamente** mostrando el dashboard principal
3. **No se requiere login** (sistema de demostración)

---

## 📊 Dashboard Principal

El dashboard es la pantalla principal que muestra un resumen completo del estado financiero de la empresa.

### Secciones del Dashboard

#### 1. **Estado de Situación Financiera**
- **Activos**: Cuentas por cobrar, efectivo, inventario, activos fijos
- **Pasivos**: Cuentas por pagar, impuestos a pagar

#### 2. **Estado de Resultados**
- **Ingresos**: Ventas, intereses
- **Gastos**: Gastos operativos, publicidad, equipo, reparaciones

#### 3. **Módulos del Sistema**
- **12 tarjetas** con acceso directo a cada módulo
- **Contadores dinámicos** que muestran la cantidad de registros
- **Iconos identificativos** para fácil navegación

### Navegación
- **Sidebar izquierdo**: Menú principal con todos los módulos
- **Contadores en tiempo real**: Números que se actualizan automáticamente
- **Búsqueda**: Funcionalidad de búsqueda en cada módulo

---

## 🏢 Módulos del Sistema

### 1. **Clientes** 👥
**Propósito**: Gestionar la información de los clientes de la empresa.

#### Funcionalidades:
- ✅ Crear nuevos clientes
- ✅ Editar información existente
- ✅ Eliminar clientes
- ✅ Buscar clientes
- ✅ Ver historial de facturas

#### Campos principales:
- Nombre completo
- RFC (Registro Federal de Contribuyentes)
- Dirección
- Teléfono
- Email
- Fecha de registro

### 2. **Proveedores** 🏢
**Propósito**: Administrar la información de proveedores y sus datos.

#### Funcionalidades:
- ✅ Registrar nuevos proveedores
- ✅ Actualizar datos de contacto
- ✅ Gestionar información fiscal
- ✅ Ver historial de compras

#### Campos principales:
- Nombre de la empresa
- RFC
- Dirección fiscal
- Contacto comercial
- Información bancaria

### 3. **Cuentas de Efectivo y Bancos** 💳
**Propósito**: Control de efectivo y cuentas bancarias.

#### Funcionalidades:
- ✅ Registrar cuentas bancarias
- ✅ Control de saldos
- ✅ Actualización automática de saldos
- ✅ Seguimiento de movimientos

#### Campos principales:
- Nombre de la cuenta
- Banco
- Número de cuenta
- Saldo inicial
- Saldo actual

### 4. **Artículos de Inventario** 📦
**Propósito**: Gestión del catálogo de productos.

#### Funcionalidades:
- ✅ Crear artículos
- ✅ Control de stock
- ✅ Precios de compra y venta
- ✅ Alertas de stock mínimo
- ✅ Unidades de medida

#### Campos principales:
- Código del artículo
- Nombre y descripción
- Precio de compra
- Precio de venta
- Stock actual
- Stock mínimo
- Unidad de medida

### 5. **Facturas de Venta** 📄
**Propósito**: Emisión y seguimiento de facturas de venta.

#### Funcionalidades:
- ✅ Crear facturas de venta
- ✅ Seleccionar cliente
- ✅ Agregar múltiples productos
- ✅ Cálculo automático de totales
- ✅ Generación de folio automático
- ✅ Estados: Pendiente, Pagada, Cancelada

#### Proceso de creación:
1. Seleccionar fecha
2. Elegir cliente
3. Agregar productos con cantidades
4. Revisar totales (subtotal, IVA 15%, total)
5. Guardar factura

### 6. **Facturas de Compra** 🛒
**Propósito**: Registro de compras y facturas de proveedores.

#### Funcionalidades:
- ✅ Registrar facturas de compra
- ✅ Seleccionar proveedor
- ✅ Agregar productos comprados
- ✅ Cálculo automático de totales
- ✅ Estados: Pendiente, Pagada, Cancelada

### 7. **Recibos** 🧾
**Propósito**: Control de cobros y recibos de pago.

#### Funcionalidades:
- ✅ Crear recibos de cobro
- ✅ Asociar con facturas de venta
- ✅ Seleccionar cuenta bancaria
- ✅ Actualización automática de saldos
- ✅ Métodos de pago

#### Campos principales:
- Folio automático
- Fecha
- Cliente
- Factura asociada (opcional)
- Cuenta bancaria
- Monto
- Concepto
- Método de pago

### 8. **Pagos** 💰
**Propósito**: Gestión de pagos a proveedores.

#### Funcionalidades:
- ✅ Registrar pagos a proveedores
- ✅ Asociar con facturas de compra
- ✅ Actualización de saldos bancarios
- ✅ Control de métodos de pago

### 9. **Empleados** 👤
**Propósito**: Administración de personal.

#### Funcionalidades:
- ✅ Registrar empleados
- ✅ Información personal y laboral
- ✅ Control de salarios
- ✅ Estados activo/inactivo

#### Campos principales:
- Nombre completo
- RFC y CURP
- Fecha de nacimiento
- Fecha de ingreso
- Salario diario
- Puesto
- Estado activo

### 10. **Recibos de Nómina** 📋
**Propósito**: Cálculo y emisión de recibos de nómina.

#### Funcionalidades:
- ✅ Generar recibos de nómina
- ✅ Cálculo automático de totales
- ✅ Períodos de pago
- ✅ Horas extra y bonos
- ✅ Deducciones

#### Cálculos automáticos:
- Salario base
- Horas extra
- Bonos
- Deducciones
- Total bruto
- Total neto

### 11. **Activos Fijos** 🔧
**Propósito**: Control de propiedad, planta y equipo.

#### Funcionalidades:
- ✅ Registrar activos fijos
- ✅ Categorización
- ✅ Control de depreciación
- ✅ Estados: Activo, Vendido, Dado de baja

#### Campos principales:
- Código del activo
- Nombre y descripción
- Categoría
- Valor de adquisición
- Fecha de adquisición
- Vida útil en años
- Valor residual

### 12. **Asientos Contables** 📚
**Propósito**: Registro de movimientos contables.

#### Funcionalidades:
- ✅ Crear asientos manuales
- ✅ Generación automática desde facturas
- ✅ Validación debe = haber
- ✅ Estados: Borrador, Aplicado, Cancelado
- ✅ Filtros por mes y año

#### Tipos de asientos:
- **Automáticos**: Generados al crear facturas
- **Manuales**: Creados por el usuario
- **Validación**: Debe siempre igual a Haber

---

## 🔄 Flujo de Trabajo Contable

### **Configuración Inicial** (Primera vez)
1. **Registrar clientes** → Información básica
2. **Registrar proveedores** → Datos comerciales
3. **Configurar cuentas bancarias** → Efectivo disponible
4. **Crear artículos de inventario** → Catálogo de productos
5. **Registrar empleados** → Personal de la empresa

### **Operaciones Diarias**
1. **Facturas de venta** → Registrar ventas
2. **Recibos de cobro** → Registrar pagos recibidos
3. **Facturas de compra** → Registrar compras
4. **Pagos a proveedores** → Registrar pagos realizados

### **Procesos Contables**
1. **Asientos automáticos** → Se generan al crear facturas
2. **Asientos manuales** → Para ajustes y otros movimientos
3. **Recibos de nómina** → Cálculo de salarios
4. **Activos fijos** → Control de depreciación

---

## 📖 Guías Paso a Paso

### **Crear una Factura de Venta**

1. **Acceder al módulo**:
   - Click en "Facturas de ventas" en el sidebar
   - Click en el botón "Nueva Factura"

2. **Llenar datos básicos**:
   - Seleccionar fecha
   - Elegir cliente del dropdown
   - Seleccionar estado (Pendiente/Pagada)

3. **Agregar productos**:
   - Click en "+ Agregar Producto"
   - Seleccionar artículo del dropdown
   - Ingresar cantidad
   - El precio unitario se llena automáticamente
   - El subtotal se calcula automáticamente

4. **Revisar totales**:
   - Subtotal: Suma de todos los productos
   - IVA (15%): Calculado automáticamente
   - Total: Subtotal + IVA

5. **Guardar**:
   - Click en "Crear Factura"
   - Se genera folio automático
   - Se crea asiento contable automático

### **Registrar un Recibo de Cobro**

1. **Acceder al módulo**:
   - Click en "Recibos" en el sidebar
   - Click en "Nuevo Recibo"

2. **Llenar información**:
   - Seleccionar fecha
   - Elegir cliente
   - Asociar con factura (opcional)
   - Seleccionar cuenta bancaria
   - Ingresar monto
   - Agregar concepto

3. **Guardar**:
   - Click en "Crear Recibo"
   - Se actualiza automáticamente el saldo bancario

### **Crear un Asiento Contable Manual**

1. **Acceder al módulo**:
   - Click en "Asientos de diario" en el sidebar
   - Click en "Nuevo Asiento"

2. **Llenar datos básicos**:
   - Seleccionar fecha
   - Escribir concepto
   - Seleccionar estado

3. **Agregar movimientos**:
   - Click en "+ Agregar Movimiento"
   - Seleccionar cuenta contable
   - Ingresar monto en debe o haber
   - Agregar concepto del movimiento

4. **Validar**:
   - El total debe = total haber
   - Si no coincide, no se puede guardar

5. **Guardar**:
   - Click en "Crear Asiento"
   - Se genera folio automático

---

## 🔧 Solución de Problemas

### **Problemas Comunes**

#### **El sistema no carga**
- ✅ Verificar que el backend esté corriendo en puerto 5000
- ✅ Verificar que el frontend esté corriendo en puerto 3000
- ✅ Refrescar la página del navegador

#### **Los contadores no se actualizan**
- ✅ Refrescar la página
- ✅ Verificar conexión con el backend
- ✅ Los contadores se actualizan automáticamente al crear/editar/eliminar registros

#### **Error al crear facturas**
- ✅ Verificar que existan clientes registrados
- ✅ Verificar que existan artículos en inventario
- ✅ Verificar que los campos obligatorios estén llenos

#### **Error al crear asientos contables**
- ✅ Verificar que el total debe = total haber
- ✅ Verificar que todos los campos estén llenos
- ✅ Verificar que las cuentas contables estén escritas correctamente

### **Mensajes de Error Comunes**

#### **"Error al cargar los datos"**
- **Causa**: Problema de conexión con el backend
- **Solución**: Verificar que el servidor Flask esté corriendo

#### **"El total del debe debe ser igual al total del haber"**
- **Causa**: Asiento contable desbalanceado
- **Solución**: Ajustar los montos hasta que coincidan

#### **"Cliente no encontrado"**
- **Causa**: No hay clientes registrados
- **Solución**: Ir al módulo Clientes y crear al menos uno

---

## 📞 Soporte Técnico

### **Información del Sistema**
- **Versión**: 1.0.0
- **Tecnologías**: React + Flask + MySQL
- **Navegadores soportados**: Chrome, Firefox, Safari, Edge
- **Resolución recomendada**: 1024x768 o superior

### **Contacto**
- **Email**: soporte@sistemacontable.com
- **Teléfono**: +52 (55) 1234-5678
- **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM

---

## 📝 Notas Importantes

### **Backup de Datos**
- Se recomienda hacer respaldos regulares de la base de datos
- Los datos se almacenan en MySQL
- Contactar al administrador del sistema para respaldos

### **Actualizaciones**
- El sistema se actualiza automáticamente
- Los cambios se reflejan inmediatamente
- No se requiere reiniciar el navegador

### **Seguridad**
- El sistema está diseñado para uso interno
- No compartir credenciales de acceso
- Cerrar sesión al terminar el trabajo

---

**Desarrollado por**: Dennys Heras, Darky Gonzalez

**© 2024 Sistema Contable - Todos los derechos reservados**

*Este manual está actualizado a la versión 1.0.0 del sistema*
