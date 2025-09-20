from flask import Flask, jsonify, request
from flask_cors import CORS
from database import create_app, init_db, db
from models import *
from datetime import datetime, date
from decimal import Decimal
import os

app = create_app()
CORS(app)

# Initialize database
init_db(app)

# Utility functions
def generate_folio(prefix, model_class):
    """Generate unique folio for invoices, receipts, etc."""
    today = datetime.now().strftime('%Y%m%d')
    count = model_class.query.filter(
        model_class.folio.like(f'{prefix}{today}%')
    ).count() + 1
    return f'{prefix}{today}{count:03d}'

# Dashboard/Summary Routes
@app.route('/api/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """Get financial summary for dashboard"""
    try:
        # Calculate Assets
        cuentas_por_cobrar = db.session.query(db.func.coalesce(db.func.sum(FacturaVenta.total), 0)).filter(
            FacturaVenta.estado == 'Pendiente'
        ).scalar() or 0
        
        efectivo = db.session.query(db.func.coalesce(db.func.sum(CuentaBancaria.saldo_actual), 0)).scalar() or 0
        
        inventario = db.session.query(db.func.coalesce(
            db.func.sum(ArticuloInventario.stock_actual * ArticuloInventario.precio_compra), 0
        )).scalar() or 0
        
        activos_fijos = db.session.query(db.func.coalesce(
            db.func.sum(ActivoFijo.valor_adquisicion), 0
        )).filter(ActivoFijo.estado == 'Activo').scalar() or 0
        
        total_activos = cuentas_por_cobrar + efectivo + inventario + activos_fijos
        
        # Calculate Liabilities
        cuentas_por_pagar = db.session.query(db.func.coalesce(db.func.sum(FacturaCompra.total), 0)).filter(
            FacturaCompra.estado == 'Pendiente'
        ).scalar() or 0
        
        impuestos_pagar = cuentas_por_pagar * Decimal('0.15')  # 15% IVA
        
        total_pasivos = cuentas_por_pagar + impuestos_pagar
        
        # Calculate Income
        ventas = db.session.query(db.func.coalesce(db.func.sum(FacturaVenta.total), 0)).filter(
            FacturaVenta.estado == 'Pagada'
        ).scalar() or 0
        
        intereses = Decimal('565')  # Placeholder for interest income
        
        total_ingresos = ventas + intereses
        
        # Calculate Expenses
        gastos_contabilidad = Decimal('5656')  # Placeholder
        publicidad = Decimal('8945')  # Placeholder
        equipo_computo = Decimal('3254')  # Placeholder
        reparaciones = Decimal('5658')  # Placeholder
        
        total_gastos = gastos_contabilidad + publicidad + equipo_computo + reparaciones
        
        return jsonify({
            'activos': {
                'total': float(total_activos),
                'detalle': {
                    'cuentas_por_cobrar': float(cuentas_por_cobrar),
                    'efectivo': float(efectivo),
                    'inventario': float(inventario),
                    'activos_fijos': float(activos_fijos)
                }
            },
            'pasivos': {
                'total': float(total_pasivos),
                'detalle': {
                    'cuentas_por_pagar': float(cuentas_por_pagar),
                    'impuestos_pagar': float(impuestos_pagar)
                }
            },
            'ingresos': {
                'total': float(total_ingresos),
                'detalle': {
                    'ventas': float(ventas),
                    'intereses': float(intereses)
                }
            },
            'gastos': {
                'total': float(total_gastos),
                'detalle': {
                    'gastos_contabilidad': float(gastos_contabilidad),
                    'publicidad': float(publicidad),
                    'equipo_computo': float(equipo_computo),
                    'reparaciones': float(reparaciones)
                }
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Client Routes
@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    """Get all clients"""
    try:
        clientes = Cliente.query.all()
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'rfc': c.rfc,
            'direccion': c.direccion,
            'telefono': c.telefono,
            'email': c.email,
            'fecha_registro': c.fecha_registro.isoformat() if c.fecha_registro else None
        } for c in clientes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clientes', methods=['POST'])
def create_cliente():
    """Create new client"""
    try:
        data = request.get_json()
        cliente = Cliente(
            nombre=data['nombre'],
            rfc=data.get('rfc'),
            direccion=data.get('direccion'),
            telefono=data.get('telefono'),
            email=data.get('email')
        )
        db.session.add(cliente)
        db.session.commit()
        return jsonify({'id': cliente.id, 'message': 'Cliente creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Supplier Routes
@app.route('/api/proveedores', methods=['GET'])
def get_proveedores():
    """Get all suppliers"""
    try:
        proveedores = Proveedor.query.all()
        return jsonify([{
            'id': p.id,
            'nombre': p.nombre,
            'rfc': p.rfc,
            'direccion': p.direccion,
            'telefono': p.telefono,
            'email': p.email,
            'fecha_registro': p.fecha_registro.isoformat() if p.fecha_registro else None
        } for p in proveedores])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/proveedores', methods=['POST'])
def create_proveedor():
    """Create new supplier"""
    try:
        data = request.get_json()
        proveedor = Proveedor(
            nombre=data['nombre'],
            rfc=data.get('rfc'),
            direccion=data.get('direccion'),
            telefono=data.get('telefono'),
            email=data.get('email')
        )
        db.session.add(proveedor)
        db.session.commit()
        return jsonify({'id': proveedor.id, 'message': 'Proveedor creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Bank Account Routes
@app.route('/api/cuentas-bancarias', methods=['GET'])
def get_cuentas_bancarias():
    """Get all bank accounts"""
    try:
        cuentas = CuentaBancaria.query.all()
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'banco': c.banco,
            'numero_cuenta': c.numero_cuenta,
            'saldo_actual': float(c.saldo_actual),
            'fecha_apertura': c.fecha_apertura.isoformat() if c.fecha_apertura else None
        } for c in cuentas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cuentas-bancarias', methods=['POST'])
def create_cuenta_bancaria():
    """Create new bank account"""
    try:
        data = request.get_json()
        cuenta = CuentaBancaria(
            nombre=data['nombre'],
            banco=data['banco'],
            numero_cuenta=data['numero_cuenta'],
            saldo_inicial=Decimal(str(data.get('saldo_inicial', 0))),
            saldo_actual=Decimal(str(data.get('saldo_inicial', 0)))
        )
        db.session.add(cuenta)
        db.session.commit()
        return jsonify({'id': cuenta.id, 'message': 'Cuenta bancaria creada exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Inventory Routes
@app.route('/api/articulos', methods=['GET'])
def get_articulos():
    """Get all inventory items"""
    try:
        articulos = ArticuloInventario.query.all()
        return jsonify([{
            'id': a.id,
            'codigo': a.codigo,
            'nombre': a.nombre,
            'descripcion': a.descripcion,
            'precio_compra': float(a.precio_compra) if a.precio_compra else None,
            'precio_venta': float(a.precio_venta) if a.precio_venta else None,
            'stock_actual': a.stock_actual,
            'stock_minimo': a.stock_minimo,
            'unidad_medida': a.unidad_medida
        } for a in articulos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/articulos', methods=['POST'])
def create_articulo():
    """Create new inventory item"""
    try:
        data = request.get_json()
        articulo = ArticuloInventario(
            codigo=data['codigo'],
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            precio_compra=Decimal(str(data.get('precio_compra', 0))) if data.get('precio_compra') else None,
            precio_venta=Decimal(str(data.get('precio_venta', 0))) if data.get('precio_venta') else None,
            stock_actual=data.get('stock_actual', 0),
            stock_minimo=data.get('stock_minimo', 0),
            unidad_medida=data.get('unidad_medida', 'PZA')
        )
        db.session.add(articulo)
        db.session.commit()
        return jsonify({'id': articulo.id, 'message': 'Artículo creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Sales Invoice Routes
@app.route('/api/facturas-venta', methods=['GET'])
def get_facturas_venta():
    """Get all sales invoices"""
    try:
        facturas = FacturaVenta.query.all()
        return jsonify([{
            'id': f.id,
            'folio': f.folio,
            'fecha': f.fecha.isoformat() if f.fecha else None,
            'cliente_nombre': f.cliente.nombre if f.cliente else None,
            'subtotal': float(f.subtotal),
            'iva': float(f.iva),
            'total': float(f.total),
            'estado': f.estado
        } for f in facturas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_journal_entry_for_sale(factura_id, cliente_id, subtotal, iva, total, fecha, concepto="Venta de productos"):
    """Create journal entry for sales invoice"""
    try:
        # Generate folio for journal entry
        folio = generate_folio('AC', AsientoContable)
        
        # Create journal entry
        asiento = AsientoContable(
            folio=folio,
            fecha=fecha,
            mes=fecha.month,
            anio=fecha.year,
            concepto=f"{concepto} - Factura {FacturaVenta.query.get(factura_id).folio}",
            total_debe=total,
            total_haber=total,
            estado='Aplicado'
        )
        db.session.add(asiento)
        db.session.flush()  # Get the ID
        
        # Create movements
        movimientos = [
            {
                'cuenta': 'Cuentas por Cobrar',
                'debe': total,
                'haber': 0,
                'concepto': f'Cobro pendiente - Cliente ID: {cliente_id}'
            },
            {
                'cuenta': 'Ventas',
                'debe': 0,
                'haber': subtotal,
                'concepto': 'Venta de productos'
            },
            {
                'cuenta': 'IVA por Pagar',
                'debe': 0,
                'haber': iva,
                'concepto': 'IVA de venta'
            }
        ]
        
        for mov_data in movimientos:
            movimiento = MovimientoContable(
                asiento_id=asiento.id,
                cuenta=mov_data['cuenta'],
                debe=Decimal(str(mov_data['debe'])),
                haber=Decimal(str(mov_data['haber'])),
                concepto=mov_data['concepto']
            )
            db.session.add(movimiento)
        
        return asiento.id
    except Exception as e:
        print(f"Error creating journal entry: {e}")
        return None

def create_journal_entry_for_purchase(factura_id, proveedor_id, subtotal, iva, total, fecha, concepto="Compra de productos"):
    """Create journal entry for purchase invoice"""
    try:
        # Generate folio for journal entry
        folio = generate_folio('AC', AsientoContable)
        
        # Create journal entry
        asiento = AsientoContable(
            folio=folio,
            fecha=fecha,
            mes=fecha.month,
            anio=fecha.year,
            concepto=f"{concepto} - Factura {FacturaCompra.query.get(factura_id).folio}",
            total_debe=total,
            total_haber=total,
            estado='Aplicado'
        )
        db.session.add(asiento)
        db.session.flush()  # Get the ID
        
        # Create movements
        movimientos = [
            {
                'cuenta': 'Compras',
                'debe': subtotal,
                'haber': 0,
                'concepto': 'Compra de productos'
            },
            {
                'cuenta': 'IVA Acreditable',
                'debe': iva,
                'haber': 0,
                'concepto': 'IVA de compra'
            },
            {
                'cuenta': 'Cuentas por Pagar',
                'debe': 0,
                'haber': total,
                'concepto': f'Pago pendiente - Proveedor ID: {proveedor_id}'
            }
        ]
        
        for mov_data in movimientos:
            movimiento = MovimientoContable(
                asiento_id=asiento.id,
                cuenta=mov_data['cuenta'],
                debe=Decimal(str(mov_data['debe'])),
                haber=Decimal(str(mov_data['haber'])),
                concepto=mov_data['concepto']
            )
            db.session.add(movimiento)
        
        return asiento.id
    except Exception as e:
        print(f"Error creating journal entry: {e}")
        return None

@app.route('/api/facturas-venta', methods=['POST'])
def create_factura_venta():
    """Create new sales invoice"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('FV', FacturaVenta)
        
        # Calculate totals
        subtotal = sum(Decimal(str(item['precio_unitario'])) * item['cantidad'] for item in data['detalles'])
        iva = subtotal * Decimal('0.15')
        total = subtotal + iva
        
        # Create invoice
        factura = FacturaVenta(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            cliente_id=data['cliente_id'],
            subtotal=subtotal,
            iva=iva,
            total=total,
            estado=data.get('estado', 'Pendiente')
        )
        db.session.add(factura)
        db.session.flush()  # Get the ID
        
        # Create details
        for detalle_data in data['detalles']:
            detalle = DetalleFacturaVenta(
                factura_venta_id=factura.id,
                articulo_id=detalle_data['articulo_id'],
                cantidad=detalle_data['cantidad'],
                precio_unitario=Decimal(str(detalle_data['precio_unitario'])),
                subtotal=Decimal(str(detalle_data['precio_unitario'])) * detalle_data['cantidad']
            )
            db.session.add(detalle)
        
        # Create automatic journal entry
        asiento_id = create_journal_entry_for_sale(
            factura.id, 
            data['cliente_id'], 
            subtotal, 
            iva, 
            total, 
            factura.fecha
        )
        
        db.session.commit()
        
        response_data = {
            'id': factura.id, 
            'folio': folio, 
            'message': 'Factura de venta creada exitosamente',
            'asiento_id': asiento_id
        }
        
        return jsonify(response_data), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Purchase Invoice Routes
@app.route('/api/facturas-compra', methods=['GET'])
def get_facturas_compra():
    """Get all purchase invoices"""
    try:
        facturas = FacturaCompra.query.all()
        return jsonify([{
            'id': f.id,
            'folio': f.folio,
            'fecha': f.fecha.isoformat() if f.fecha else None,
            'proveedor_nombre': f.proveedor.nombre if f.proveedor else None,
            'subtotal': float(f.subtotal),
            'iva': float(f.iva),
            'total': float(f.total),
            'estado': f.estado
        } for f in facturas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/facturas-compra', methods=['POST'])
def create_factura_compra():
    """Create new purchase invoice"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('FC', FacturaCompra)
        
        # Calculate totals
        subtotal = sum(Decimal(str(item['precio_unitario'])) * item['cantidad'] for item in data['detalles'])
        iva = subtotal * Decimal('0.15')
        total = subtotal + iva
        
        # Create invoice
        factura = FacturaCompra(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            proveedor_id=data['proveedor_id'],
            subtotal=subtotal,
            iva=iva,
            total=total,
            estado=data.get('estado', 'Pendiente')
        )
        db.session.add(factura)
        db.session.flush()  # Get the ID
        
        # Create details
        for detalle_data in data['detalles']:
            detalle = DetalleFacturaCompra(
                factura_compra_id=factura.id,
                articulo_id=detalle_data['articulo_id'],
                cantidad=detalle_data['cantidad'],
                precio_unitario=Decimal(str(detalle_data['precio_unitario'])),
                subtotal=Decimal(str(detalle_data['precio_unitario'])) * detalle_data['cantidad']
            )
            db.session.add(detalle)
        
        # Create automatic journal entry
        asiento_id = create_journal_entry_for_purchase(
            factura.id, 
            data['proveedor_id'], 
            subtotal, 
            iva, 
            total, 
            factura.fecha
        )
        
        db.session.commit()
        
        response_data = {
            'id': factura.id, 
            'folio': folio, 
            'message': 'Factura de compra creada exitosamente',
            'asiento_id': asiento_id
        }
        
        return jsonify(response_data), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Receipt Routes
@app.route('/api/recibos', methods=['GET'])
def get_recibos():
    """Get all receipts"""
    try:
        recibos = Recibo.query.all()
        return jsonify([{
            'id': r.id,
            'folio': r.folio,
            'fecha': r.fecha.isoformat() if r.fecha else None,
            'cliente_nombre': r.cliente.nombre if r.cliente else None,
            'monto': float(r.monto),
            'concepto': r.concepto,
            'metodo_pago': r.metodo_pago
        } for r in recibos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recibos', methods=['POST'])
def create_recibo():
    """Create new receipt"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('RC', Recibo)
        
        recibo = Recibo(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            cliente_id=data['cliente_id'],
            factura_venta_id=data.get('factura_venta_id'),
            cuenta_bancaria_id=data['cuenta_bancaria_id'],
            monto=Decimal(str(data['monto'])),
            concepto=data.get('concepto'),
            metodo_pago=data.get('metodo_pago', 'Efectivo')
        )
        db.session.add(recibo)
        
        # Update bank account balance
        cuenta = CuentaBancaria.query.get(data['cuenta_bancaria_id'])
        cuenta.saldo_actual += Decimal(str(data['monto']))
        
        db.session.commit()
        return jsonify({'id': recibo.id, 'folio': folio, 'message': 'Recibo creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Payment Routes
@app.route('/api/pagos', methods=['GET'])
def get_pagos():
    """Get all payments"""
    try:
        pagos = Pago.query.all()
        return jsonify([{
            'id': p.id,
            'folio': p.folio,
            'fecha': p.fecha.isoformat() if p.fecha else None,
            'proveedor_nombre': p.proveedor.nombre if p.proveedor else None,
            'monto': float(p.monto),
            'concepto': p.concepto,
            'metodo_pago': p.metodo_pago
        } for p in pagos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pagos', methods=['POST'])
def create_pago():
    """Create new payment"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('PG', Pago)
        
        pago = Pago(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            proveedor_id=data['proveedor_id'],
            factura_compra_id=data.get('factura_compra_id'),
            cuenta_bancaria_id=data['cuenta_bancaria_id'],
            monto=Decimal(str(data['monto'])),
            concepto=data.get('concepto'),
            metodo_pago=data.get('metodo_pago', 'Efectivo')
        )
        db.session.add(pago)
        
        # Update bank account balance
        cuenta = CuentaBancaria.query.get(data['cuenta_bancaria_id'])
        cuenta.saldo_actual -= Decimal(str(data['monto']))
        
        db.session.commit()
        return jsonify({'id': pago.id, 'folio': folio, 'message': 'Pago creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Employee Routes
@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    """Get all employees"""
    try:
        empleados = Empleado.query.all()
        return jsonify([{
            'id': e.id,
            'nombre': e.nombre,
            'apellido_paterno': e.apellido_paterno,
            'apellido_materno': e.apellido_materno,
            'rfc': e.rfc,
            'curp': e.curp,
            'fecha_nacimiento': e.fecha_nacimiento.isoformat() if e.fecha_nacimiento else None,
            'fecha_ingreso': e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
            'salario_diario': float(e.salario_diario) if e.salario_diario else None,
            'puesto': e.puesto,
            'activo': e.activo
        } for e in empleados])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados', methods=['POST'])
def create_empleado():
    """Create new employee"""
    try:
        data = request.get_json()
        empleado = Empleado(
            nombre=data['nombre'],
            apellido_paterno=data['apellido_paterno'],
            apellido_materno=data.get('apellido_materno'),
            rfc=data.get('rfc'),
            curp=data.get('curp'),
            fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date() if data.get('fecha_nacimiento') else None,
            salario_diario=Decimal(str(data['salario_diario'])) if data.get('salario_diario') else None,
            puesto=data.get('puesto'),
            activo=data.get('activo', True)
        )
        db.session.add(empleado)
        db.session.commit()
        return jsonify({'id': empleado.id, 'message': 'Empleado creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Fixed Assets Routes
@app.route('/api/activos-fijos', methods=['GET'])
def get_activos_fijos():
    """Get all fixed assets"""
    try:
        activos = ActivoFijo.query.all()
        return jsonify([{
            'id': a.id,
            'codigo': a.codigo,
            'nombre': a.nombre,
            'descripcion': a.descripcion,
            'categoria': a.categoria,
            'valor_adquisicion': float(a.valor_adquisicion),
            'fecha_adquisicion': a.fecha_adquisicion.isoformat() if a.fecha_adquisicion else None,
            'vida_util_anos': a.vida_util_anos,
            'valor_residual': float(a.valor_residual),
            'estado': a.estado
        } for a in activos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activos-fijos', methods=['POST'])
def create_activo_fijo():
    """Create new fixed asset"""
    try:
        data = request.get_json()
        activo = ActivoFijo(
            codigo=data['codigo'],
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            categoria=data.get('categoria'),
            valor_adquisicion=Decimal(str(data['valor_adquisicion'])),
            fecha_adquisicion=datetime.strptime(data['fecha_adquisicion'], '%Y-%m-%d').date(),
            vida_util_anos=data.get('vida_util_anos', 5),
            valor_residual=Decimal(str(data.get('valor_residual', 0))),
            estado=data.get('estado', 'Activo')
        )
        db.session.add(activo)
        db.session.commit()
        return jsonify({'id': activo.id, 'message': 'Activo fijo creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Journal Entry Routes

@app.route('/api/asientos-contables', methods=['POST'])
def create_asiento_contable():
    """Create new journal entry"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('AC', AsientoContable)
        
        # Calculate totals
        total_debe = sum(Decimal(str(mov['debe'])) for mov in data['movimientos'])
        total_haber = sum(Decimal(str(mov['haber'])) for mov in data['movimientos'])
        
        if total_debe != total_haber:
            return jsonify({'error': 'El total del debe debe ser igual al total del haber'}), 400
        
        # Create journal entry
        asiento = AsientoContable(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            mes=datetime.strptime(data['fecha'], '%Y-%m-%d').date().month,
            anio=datetime.strptime(data['fecha'], '%Y-%m-%d').date().year,
            concepto=data['concepto'],
            total_debe=total_debe,
            total_haber=total_haber,
            estado=data.get('estado', 'Borrador')
        )
        db.session.add(asiento)
        db.session.flush()  # Get the ID
        
        # Create movements
        for mov_data in data['movimientos']:
            movimiento = MovimientoContable(
                asiento_id=asiento.id,
                cuenta=mov_data['cuenta'],
                debe=Decimal(str(mov_data['debe'])),
                haber=Decimal(str(mov_data['haber'])),
                concepto=mov_data.get('concepto')
            )
            db.session.add(movimiento)
        
        db.session.commit()
        return jsonify({'id': asiento.id, 'folio': folio, 'message': 'Asiento contable creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Payroll Routes
@app.route('/api/recibos-nomina', methods=['GET'])
def get_recibos_nomina():
    """Get all payroll receipts"""
    try:
        recibos = ReciboNomina.query.all()
        return jsonify([{
            'id': r.id,
            'folio': r.folio,
            'fecha': r.fecha.isoformat() if r.fecha else None,
            'empleado_nombre': f"{r.empleado.nombre} {r.empleado.apellido_paterno}" if r.empleado else None,
            'periodo_inicio': r.periodo_inicio.isoformat() if r.periodo_inicio else None,
            'periodo_fin': r.periodo_fin.isoformat() if r.periodo_fin else None,
            'total_bruto': float(r.total_bruto),
            'total_neto': float(r.total_neto)
        } for r in recibos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recibos-nomina', methods=['POST'])
def create_recibo_nomina():
    """Create new payroll receipt"""
    try:
        data = request.get_json()
        
        # Generate folio
        folio = generate_folio('RN', ReciboNomina)
        
        # Calculate totals
        salario_base = Decimal(str(data['salario_base']))
        horas_extra = Decimal(str(data.get('horas_extra', 0)))
        bonos = Decimal(str(data.get('bonos', 0)))
        deducciones = Decimal(str(data.get('deducciones', 0)))
        
        total_bruto = salario_base + (horas_extra * salario_base / 8) + bonos
        total_neto = total_bruto - deducciones
        
        recibo = ReciboNomina(
            folio=folio,
            fecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date(),
            empleado_id=data['empleado_id'],
            periodo_inicio=datetime.strptime(data['periodo_inicio'], '%Y-%m-%d').date(),
            periodo_fin=datetime.strptime(data['periodo_fin'], '%Y-%m-%d').date(),
            salario_base=salario_base,
            horas_extra=horas_extra,
            bonos=bonos,
            deducciones=deducciones,
            total_bruto=total_bruto,
            total_neto=total_neto
        )
        db.session.add(recibo)
        db.session.commit()
        return jsonify({'id': recibo.id, 'folio': folio, 'message': 'Recibo de nómina creado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Count endpoints for sidebar
@app.route('/api/counts', methods=['GET'])
def get_counts():
    """Get counts for all modules for sidebar"""
    try:
        counts = {
            'clientes': Cliente.query.count(),
            'proveedores': Proveedor.query.count(),
            'cuentas_bancarias': CuentaBancaria.query.count(),
            'articulos': ArticuloInventario.query.count(),
            'facturas_venta': FacturaVenta.query.count(),
            'facturas_compra': FacturaCompra.query.count(),
            'recibos': Recibo.query.count(),
            'pagos': Pago.query.count(),
            'empleados': Empleado.query.count(),
            'recibos_nomina': ReciboNomina.query.count(),
            'activos_fijos': ActivoFijo.query.count(),
            'asientos_contables': AsientoContable.query.count()
        }
        return jsonify(counts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Journal entries with month/year filtering
@app.route('/api/asientos-contables', methods=['GET'])
def get_asientos_contables():
    """Get journal entries with optional month/year filtering"""
    try:
        mes = request.args.get('mes', type=int)
        anio = request.args.get('anio', type=int)
        
        query = AsientoContable.query
        
        if mes:
            query = query.filter(AsientoContable.mes == mes)
        if anio:
            query = query.filter(AsientoContable.anio == anio)
            
        asientos = query.order_by(AsientoContable.fecha.desc()).all()
        
        result = []
        for asiento in asientos:
            asiento_data = {
                'id': asiento.id,
                'folio': asiento.folio,
                'fecha': asiento.fecha.isoformat(),
                'mes': asiento.mes,
                'anio': asiento.anio,
                'concepto': asiento.concepto,
                'total_debe': float(asiento.total_debe),
                'total_haber': float(asiento.total_haber),
                'estado': asiento.estado,
                'fecha_creacion': asiento.fecha_creacion.isoformat(),
                'movimientos': []
            }
            
            for movimiento in asiento.movimientos:
                asiento_data['movimientos'].append({
                    'id': movimiento.id,
                    'cuenta': movimiento.cuenta,
                    'debe': float(movimiento.debe),
                    'haber': float(movimiento.haber),
                    'concepto': movimiento.concepto
                })
            
            result.append(asiento_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/asientos-contables/periodos', methods=['GET'])
def get_periodos_disponibles():
    """Get available months and years for filtering"""
    try:
        periodos = db.session.query(
            AsientoContable.anio,
            AsientoContable.mes,
            db.func.count(AsientoContable.id).label('cantidad')
        ).group_by(
            AsientoContable.anio,
            AsientoContable.mes
        ).order_by(
            AsientoContable.anio.desc(),
            AsientoContable.mes.desc()
        ).all()
        
        result = []
        for periodo in periodos:
            result.append({
                'anio': periodo.anio,
                'mes': periodo.mes,
                'cantidad': periodo.cantidad,
                'nombre_mes': [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ][periodo.mes - 1]
            })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
