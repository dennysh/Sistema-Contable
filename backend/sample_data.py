#!/usr/bin/env python3
"""
Script para insertar datos de muestra en el Sistema Contable
"""

from app import app, db
from models import *
from datetime import datetime, date
from decimal import Decimal

def create_sample_data():
    """Crea datos de muestra para demostración"""
    
    with app.app_context():
        # Limpiar datos existentes
        print("Limpiando datos existentes...")
        db.drop_all()
        db.create_all()
        
        # Crear clientes de muestra
        print("Creando clientes...")
        clientes = [
            Cliente(nombre="Empresa ABC S.A. de C.V.", rfc="ABC123456789", 
                   direccion="Av. Principal 123, Ciudad", telefono="555-0001", 
                   email="contacto@empresaabc.com"),
            Cliente(nombre="Comercial XYZ S.A.", rfc="XYZ987654321", 
                   direccion="Calle Secundaria 456, Ciudad", telefono="555-0002", 
                   email="ventas@comercialxyz.com"),
            Cliente(nombre="Distribuidora Norte", rfc="DNO456789123", 
                   direccion="Blvd. Norte 789, Ciudad", telefono="555-0003", 
                   email="info@distribuidoranorte.com"),
            Cliente(nombre="Servicios del Sur", rfc="SDS789123456", 
                   direccion="Av. Sur 321, Ciudad", telefono="555-0004", 
                   email="servicios@surservicios.com"),
            Cliente(nombre="Industrias del Este", rfc="IDE123789456", 
                   direccion="Zona Industrial Este, Ciudad", telefono="555-0005", 
                   email="produccion@industriase.com")
        ]
        
        for cliente in clientes:
            db.session.add(cliente)
        
        # Crear proveedores de muestra
        print("Creando proveedores...")
        proveedores = [
            Proveedor(nombre="Proveedor Nacional S.A.", rfc="PNA123456789", 
                     direccion="Av. Industrial 100, Ciudad", telefono="555-1001", 
                     email="ventas@proveedornacional.com"),
            Proveedor(nombre="Suministros del Centro", rfc="SDC987654321", 
                     direccion="Calle Central 200, Ciudad", telefono="555-1002", 
                     email="compras@suministroscentro.com"),
            Proveedor(nombre="Materiales Premium", rfc="MPR456789123", 
                     direccion="Blvd. Materiales 300, Ciudad", telefono="555-1003", 
                     email="info@materialespremium.com"),
            Proveedor(nombre="Servicios Generales", rfc="SGE789123456", 
                     direccion="Av. Servicios 400, Ciudad", telefono="555-1004", 
                     email="contacto@serviciosgenerales.com"),
            Proveedor(nombre="Equipos Industriales", rfc="EIN123789456", 
                     direccion="Zona Industrial Oeste, Ciudad", telefono="555-1005", 
                     email="ventas@equiposindustriales.com")
        ]
        
        for proveedor in proveedores:
            db.session.add(proveedor)
        
        # Crear cuentas bancarias
        print("Creando cuentas bancarias...")
        cuentas = [
            CuentaBancaria(nombre="Cuenta Principal", banco="BBVA", 
                          numero_cuenta="1234567890", saldo_inicial=Decimal('50000.00'), 
                          saldo_actual=Decimal('50000.00')),
            CuentaBancaria(nombre="Cuenta de Ahorros", banco="Santander", 
                          numero_cuenta="0987654321", saldo_inicial=Decimal('25000.00'), 
                          saldo_actual=Decimal('25000.00')),
            CuentaBancaria(nombre="Cuenta de Gastos", banco="HSBC", 
                          numero_cuenta="1122334455", saldo_inicial=Decimal('10000.00'), 
                          saldo_actual=Decimal('10000.00')),
            CuentaBancaria(nombre="Cuenta de Inversión", banco="Banorte", 
                          numero_cuenta="5566778899", saldo_inicial=Decimal('75000.00'), 
                          saldo_actual=Decimal('75000.00')),
            CuentaBancaria(nombre="Caja Chica", banco="Efectivo", 
                          numero_cuenta="EFECTIVO", saldo_inicial=Decimal('5000.00'), 
                          saldo_actual=Decimal('5000.00'))
        ]
        
        for cuenta in cuentas:
            db.session.add(cuenta)
        
        # Crear artículos de inventario
        print("Creando artículos de inventario...")
        articulos = [
            ArticuloInventario(codigo="ART001", nombre="Producto A", 
                              descripcion="Descripción del Producto A", 
                              precio_compra=Decimal('100.00'), precio_venta=Decimal('150.00'), 
                              stock_actual=50, stock_minimo=10, unidad_medida="PZA"),
            ArticuloInventario(codigo="ART002", nombre="Producto B", 
                              descripcion="Descripción del Producto B", 
                              precio_compra=Decimal('200.00'), precio_venta=Decimal('300.00'), 
                              stock_actual=25, stock_minimo=5, unidad_medida="PZA"),
            ArticuloInventario(codigo="ART003", nombre="Producto C", 
                              descripcion="Descripción del Producto C", 
                              precio_compra=Decimal('50.00'), precio_venta=Decimal('75.00'), 
                              stock_actual=100, stock_minimo=20, unidad_medida="PZA"),
            ArticuloInventario(codigo="ART004", nombre="Servicio X", 
                              descripcion="Descripción del Servicio X", 
                              precio_compra=Decimal('0.00'), precio_venta=Decimal('500.00'), 
                              stock_actual=0, stock_minimo=0, unidad_medida="SERV"),
            ArticuloInventario(codigo="ART005", nombre="Material Y", 
                              descripcion="Descripción del Material Y", 
                              precio_compra=Decimal('25.00'), precio_venta=Decimal('40.00'), 
                              stock_actual=200, stock_minimo=50, unidad_medida="KG")
        ]
        
        for articulo in articulos:
            db.session.add(articulo)
        
        # Crear empleados
        print("Creando empleados...")
        empleados = [
            Empleado(nombre="Juan", apellido_paterno="Pérez", apellido_materno="García", 
                    rfc="PEGJ800101ABC", curp="PEGJ800101HDFRCN01", 
                    fecha_nacimiento=date(1980, 1, 1), salario_diario=Decimal('500.00'), 
                    puesto="Gerente General", activo=True),
            Empleado(nombre="María", apellido_paterno="López", apellido_materno="Martínez", 
                    rfc="LOMM850215DEF", curp="LOMM850215MDFPRR02", 
                    fecha_nacimiento=date(1985, 2, 15), salario_diario=Decimal('400.00'), 
                    puesto="Contadora", activo=True),
            Empleado(nombre="Carlos", apellido_paterno="González", apellido_materno="Hernández", 
                    rfc="GOHC900310GHI", curp="GOHC900310HDFRRL03", 
                    fecha_nacimiento=date(1990, 3, 10), salario_diario=Decimal('350.00'), 
                    puesto="Vendedor", activo=True)
        ]
        
        for empleado in empleados:
            db.session.add(empleado)
        
        # Crear activos fijos
        print("Creando activos fijos...")
        activos = [
            ActivoFijo(codigo="AF001", nombre="Computadora Dell", 
                      descripcion="Computadora de escritorio Dell OptiPlex", 
                      categoria="Equipo de cómputo", valor_adquisicion=Decimal('15000.00'), 
                      fecha_adquisicion=date(2023, 1, 15), vida_util_anos=5, 
                      valor_residual=Decimal('2000.00'), estado="Activo"),
            ActivoFijo(codigo="AF002", nombre="Impresora HP", 
                      descripcion="Impresora multifuncional HP LaserJet", 
                      categoria="Equipo de oficina", valor_adquisicion=Decimal('8000.00'), 
                      fecha_adquisicion=date(2023, 2, 20), vida_util_anos=3, 
                      valor_residual=Decimal('1000.00'), estado="Activo"),
            ActivoFijo(codigo="AF003", nombre="Escritorio Ejecutivo", 
                      descripcion="Escritorio de madera para oficina", 
                      categoria="Mobiliario", valor_adquisicion=Decimal('5000.00'), 
                      fecha_adquisicion=date(2023, 3, 10), vida_util_anos=10, 
                      valor_residual=Decimal('500.00'), estado="Activo")
        ]
        
        for activo in activos:
            db.session.add(activo)
        
        # Crear algunas facturas de venta
        print("Creando facturas de venta...")
        facturas_venta = [
            FacturaVenta(folio="FV202401001", fecha=date(2024, 1, 15), 
                        cliente_id=1, subtotal=Decimal('1500.00'), iva=Decimal('240.00'), 
                        total=Decimal('1740.00'), estado="Pagada"),
            FacturaVenta(folio="FV202401002", fecha=date(2024, 1, 20), 
                        cliente_id=2, subtotal=Decimal('3000.00'), iva=Decimal('480.00'), 
                        total=Decimal('3480.00'), estado="Pendiente"),
            FacturaVenta(folio="FV202401003", fecha=date(2024, 1, 25), 
                        cliente_id=3, subtotal=Decimal('750.00'), iva=Decimal('120.00'), 
                        total=Decimal('870.00'), estado="Pagada")
        ]
        
        for factura in facturas_venta:
            db.session.add(factura)
        
        # Crear algunas facturas de compra
        print("Creando facturas de compra...")
        facturas_compra = [
            FacturaCompra(folio="FC202401001", fecha=date(2024, 1, 10), 
                         proveedor_id=1, subtotal=Decimal('2000.00'), iva=Decimal('320.00'), 
                         total=Decimal('2320.00'), estado="Pagada"),
            FacturaCompra(folio="FC202401002", fecha=date(2024, 1, 18), 
                         proveedor_id=2, subtotal=Decimal('1500.00'), iva=Decimal('240.00'), 
                         total=Decimal('1740.00'), estado="Pendiente")
        ]
        
        for factura in facturas_compra:
            db.session.add(factura)
        
        # Crear algunos recibos
        print("Creando recibos...")
        recibos = [
            Recibo(folio="RC202401001", fecha=date(2024, 1, 16), cliente_id=1, 
                  factura_venta_id=1, cuenta_bancaria_id=1, monto=Decimal('1740.00'), 
                  concepto="Pago de factura FV202401001", metodo_pago="Transferencia"),
            Recibo(folio="RC202401002", fecha=date(2024, 1, 26), cliente_id=3, 
                  factura_venta_id=3, cuenta_bancaria_id=2, monto=Decimal('870.00'), 
                  concepto="Pago de factura FV202401003", metodo_pago="Efectivo")
        ]
        
        for recibo in recibos:
            db.session.add(recibo)
        
        # Crear algunos pagos
        print("Creando pagos...")
        pagos = [
            Pago(folio="PG202401001", fecha=date(2024, 1, 12), proveedor_id=1, 
                factura_compra_id=1, cuenta_bancaria_id=1, monto=Decimal('2320.00'), 
                concepto="Pago de factura FC202401001", metodo_pago="Transferencia")
        ]
        
        for pago in pagos:
            db.session.add(pago)
        
        # Crear algunos recibos de nómina
        print("Creando recibos de nómina...")
        recibos_nomina = [
            ReciboNomina(folio="RN202401001", fecha=date(2024, 1, 31), empleado_id=1, 
                        periodo_inicio=date(2024, 1, 1), periodo_fin=date(2024, 1, 31), 
                        salario_base=Decimal('15000.00'), horas_extra=Decimal('0.00'), 
                        bonos=Decimal('2000.00'), deducciones=Decimal('3000.00'), 
                        total_bruto=Decimal('17000.00'), total_neto=Decimal('14000.00')),
            ReciboNomina(folio="RN202401002", fecha=date(2024, 1, 31), empleado_id=2, 
                        periodo_inicio=date(2024, 1, 1), periodo_fin=date(2024, 1, 31), 
                        salario_base=Decimal('12000.00'), horas_extra=Decimal('8.00'), 
                        bonos=Decimal('1000.00'), deducciones=Decimal('2500.00'), 
                        total_bruto=Decimal('14000.00'), total_neto=Decimal('11500.00'))
        ]
        
        for recibo in recibos_nomina:
            db.session.add(recibo)
        
        # Crear algunos asientos contables
        print("Creando asientos contables...")
        asientos = [
            AsientoContable(folio="AC202401001", fecha=date(2024, 1, 15), 
                           concepto="Venta de productos", total_debe=Decimal('1740.00'), 
                           total_haber=Decimal('1740.00'), estado="Aplicado"),
            AsientoContable(folio="AC202401002", fecha=date(2024, 1, 10), 
                           concepto="Compra de mercancía", total_debe=Decimal('2320.00'), 
                           total_haber=Decimal('2320.00'), estado="Aplicado")
        ]
        
        for asiento in asientos:
            db.session.add(asiento)
        
        # Crear movimientos contables
        print("Creando movimientos contables...")
        movimientos = [
            # Movimientos para asiento 1 (Venta)
            MovimientoContable(asiento_id=1, cuenta="Bancos", debe=Decimal('1740.00'), haber=Decimal('0.00'), concepto="Cobro de venta"),
            MovimientoContable(asiento_id=1, cuenta="Ventas", debe=Decimal('0.00'), haber=Decimal('1500.00'), concepto="Venta de productos"),
            MovimientoContable(asiento_id=1, cuenta="IVA por Pagar", debe=Decimal('0.00'), haber=Decimal('240.00'), concepto="IVA de venta"),
            
            # Movimientos para asiento 2 (Compra)
            MovimientoContable(asiento_id=2, cuenta="Compras", debe=Decimal('2000.00'), haber=Decimal('0.00'), concepto="Compra de mercancía"),
            MovimientoContable(asiento_id=2, cuenta="IVA Acreditable", debe=Decimal('320.00'), haber=Decimal('0.00'), concepto="IVA de compra"),
            MovimientoContable(asiento_id=2, cuenta="Bancos", debe=Decimal('0.00'), haber=Decimal('2320.00'), concepto="Pago a proveedor")
        ]
        
        for movimiento in movimientos:
            db.session.add(movimiento)
        
        # Actualizar saldos de cuentas bancarias
        print("Actualizando saldos de cuentas bancarias...")
        cuenta1 = CuentaBancaria.query.get(1)
        cuenta1.saldo_actual = Decimal('50000.00') + Decimal('1740.00') - Decimal('2320.00')
        
        cuenta2 = CuentaBancaria.query.get(2)
        cuenta2.saldo_actual = Decimal('25000.00') + Decimal('870.00')
        
        # Guardar todos los cambios
        print("Guardando datos en la base de datos...")
        db.session.commit()
        
        print("✅ Datos de muestra creados exitosamente!")
        print("\n📊 Resumen de datos creados:")
        print(f"- {len(clientes)} clientes")
        print(f"- {len(proveedores)} proveedores")
        print(f"- {len(cuentas)} cuentas bancarias")
        print(f"- {len(articulos)} artículos de inventario")
        print(f"- {len(empleados)} empleados")
        print(f"- {len(activos)} activos fijos")
        print(f"- {len(facturas_venta)} facturas de venta")
        print(f"- {len(facturas_compra)} facturas de compra")
        print(f"- {len(recibos)} recibos")
        print(f"- {len(pagos)} pagos")
        print(f"- {len(recibos_nomina)} recibos de nómina")
        print(f"- {len(asientos)} asientos contables")
        print(f"- {len(movimientos)} movimientos contables")

if __name__ == "__main__":
    create_sample_data()
