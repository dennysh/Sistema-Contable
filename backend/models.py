from database import db
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Numeric

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    rfc = db.Column(db.String(13), unique=True)
    direccion = db.Column(db.Text)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(100))
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    facturas_venta = db.relationship('FacturaVenta', backref='cliente', lazy=True)
    recibos = db.relationship('Recibo', backref='cliente', lazy=True)

class Proveedor(db.Model):
    __tablename__ = 'proveedores'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    rfc = db.Column(db.String(13), unique=True)
    direccion = db.Column(db.Text)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(100))
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    facturas_compra = db.relationship('FacturaCompra', backref='proveedor', lazy=True)
    pagos = db.relationship('Pago', backref='proveedor', lazy=True)

class CuentaBancaria(db.Model):
    __tablename__ = 'cuentas_bancarias'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    banco = db.Column(db.String(100), nullable=False)
    numero_cuenta = db.Column(db.String(50), unique=True)
    saldo_inicial = db.Column(db.Numeric(15, 2), default=0)  # Cambiado de Decimal a Numeric
    saldo_actual = db.Column(db.Numeric(15, 2), default=0)   # Cambiado de Decimal a Numeric
    fecha_apertura = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    recibos = db.relationship('Recibo', backref='cuenta_bancaria', lazy=True)
    pagos = db.relationship('Pago', backref='cuenta_bancaria', lazy=True)

class ArticuloInventario(db.Model):
    __tablename__ = 'articulos_inventario'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(50), unique=True, nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    precio_compra = db.Column(db.Numeric(10, 2))
    precio_venta = db.Column(db.Numeric(10, 2))
    stock_actual = db.Column(db.Integer, default=0)
    stock_minimo = db.Column(db.Integer, default=0)
    unidad_medida = db.Column(db.String(20), default='PZA')
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    detalles_factura_venta = db.relationship('DetalleFacturaVenta', backref='articulo', lazy=True)
    detalles_factura_compra = db.relationship('DetalleFacturaCompra', backref='articulo', lazy=True)

class Empleado(db.Model):
    __tablename__ = 'empleados'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido_paterno = db.Column(db.String(100), nullable=False)
    apellido_materno = db.Column(db.String(100))
    rfc = db.Column(db.String(13), unique=True)
    curp = db.Column(db.String(18), unique=True)
    fecha_nacimiento = db.Column(db.Date)
    fecha_ingreso = db.Column(db.Date, default=datetime.utcnow().date())
    salario_diario = db.Column(db.Numeric(10, 2))
    puesto = db.Column(db.String(100))
    activo = db.Column(db.Boolean, default=True)
    
    # Relaciones
    recibos_nomina = db.relationship('ReciboNomina', backref='empleado', lazy=True)

class FacturaVenta(db.Model):
    __tablename__ = 'facturas_venta'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)
    iva = db.Column(db.Numeric(15, 2), default=0)
    total = db.Column(db.Numeric(15, 2), nullable=False)
    estado = db.Column(db.String(20), default='Pendiente')  # Pendiente, Pagada, Cancelada
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    detalles = db.relationship('DetalleFacturaVenta', backref='factura_venta', lazy=True, cascade='all, delete-orphan')
    recibos = db.relationship('Recibo', backref='factura_venta', lazy=True)

class DetalleFacturaVenta(db.Model):
    __tablename__ = 'detalles_factura_venta'
    
    id = db.Column(db.Integer, primary_key=True)
    factura_venta_id = db.Column(db.Integer, db.ForeignKey('facturas_venta.id'), nullable=False)
    articulo_id = db.Column(db.Integer, db.ForeignKey('articulos_inventario.id'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)

class FacturaCompra(db.Model):
    __tablename__ = 'facturas_compra'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id'), nullable=False)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)
    iva = db.Column(db.Numeric(15, 2), default=0)
    total = db.Column(db.Numeric(15, 2), nullable=False)
    estado = db.Column(db.String(20), default='Pendiente')  # Pendiente, Pagada, Cancelada
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    detalles = db.relationship('DetalleFacturaCompra', backref='factura_compra', lazy=True, cascade='all, delete-orphan')
    pagos = db.relationship('Pago', backref='factura_compra', lazy=True)

class DetalleFacturaCompra(db.Model):
    __tablename__ = 'detalles_factura_compra'
    
    id = db.Column(db.Integer, primary_key=True)
    factura_compra_id = db.Column(db.Integer, db.ForeignKey('facturas_compra.id'), nullable=False)
    articulo_id = db.Column(db.Integer, db.ForeignKey('articulos_inventario.id'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)

class Recibo(db.Model):
    __tablename__ = 'recibos'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    factura_venta_id = db.Column(db.Integer, db.ForeignKey('facturas_venta.id'))
    cuenta_bancaria_id = db.Column(db.Integer, db.ForeignKey('cuentas_bancarias.id'), nullable=False)
    monto = db.Column(db.Numeric(15, 2), nullable=False)
    concepto = db.Column(db.String(200))
    metodo_pago = db.Column(db.String(50))  # Efectivo, Transferencia, Cheque
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class Pago(db.Model):
    __tablename__ = 'pagos'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id'), nullable=False)
    factura_compra_id = db.Column(db.Integer, db.ForeignKey('facturas_compra.id'))
    cuenta_bancaria_id = db.Column(db.Integer, db.ForeignKey('cuentas_bancarias.id'), nullable=False)
    monto = db.Column(db.Numeric(15, 2), nullable=False)
    concepto = db.Column(db.String(200))
    metodo_pago = db.Column(db.String(50))  # Efectivo, Transferencia, Cheque
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class ReciboNomina(db.Model):
    __tablename__ = 'recibos_nomina'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    empleado_id = db.Column(db.Integer, db.ForeignKey('empleados.id'), nullable=False)
    periodo_inicio = db.Column(db.Date, nullable=False)
    periodo_fin = db.Column(db.Date, nullable=False)
    salario_base = db.Column(db.Numeric(10, 2), nullable=False)
    horas_extra = db.Column(db.Numeric(5, 2), default=0)
    bonos = db.Column(db.Numeric(10, 2), default=0)
    deducciones = db.Column(db.Numeric(10, 2), default=0)
    total_bruto = db.Column(db.Numeric(10, 2), nullable=False)
    total_neto = db.Column(db.Numeric(10, 2), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class ActivoFijo(db.Model):
    __tablename__ = 'activos_fijos'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(50), unique=True, nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    categoria = db.Column(db.String(100))  # Equipo de computo, Mobiliario, Vehiculos, etc.
    valor_adquisicion = db.Column(db.Numeric(15, 2), nullable=False)
    fecha_adquisicion = db.Column(db.Date, nullable=False)
    vida_util_anos = db.Column(db.Integer, default=5)
    valor_residual = db.Column(db.Numeric(15, 2), default=0)
    estado = db.Column(db.String(20), default='Activo')  # Activo, Vendido, Dado de baja
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

class AsientoContable(db.Model):
    __tablename__ = 'asientos_contables'
    
    id = db.Column(db.Integer, primary_key=True)
    folio = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    mes = db.Column(db.Integer, nullable=False)  # 1-12
    anio = db.Column(db.Integer, nullable=False)  # Año del asiento
    concepto = db.Column(db.String(200), nullable=False)
    total_debe = db.Column(db.Numeric(15, 2), nullable=False)
    total_haber = db.Column(db.Numeric(15, 2), nullable=False)
    estado = db.Column(db.String(20), default='Borrador')  # Borrador, Aplicado, Cancelado
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    movimientos = db.relationship('MovimientoContable', backref='asiento', lazy=True, cascade='all, delete-orphan')

class MovimientoContable(db.Model):
    __tablename__ = 'movimientos_contables'
    
    id = db.Column(db.Integer, primary_key=True)
    asiento_id = db.Column(db.Integer, db.ForeignKey('asientos_contables.id'), nullable=False)
    cuenta = db.Column(db.String(100), nullable=False)  # Nombre de la cuenta contable
    debe = db.Column(db.Numeric(15, 2), default=0)
    haber = db.Column(db.Numeric(15, 2), default=0)
    concepto = db.Column(db.String(200))
