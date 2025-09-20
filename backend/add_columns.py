#!/usr/bin/env python3
"""
Script para agregar las columnas mes y anio a la tabla asientos_contables
"""

from database import create_app, db
from sqlalchemy import text

def add_columns():
    """Agregar columnas mes y anio a la tabla asientos_contables"""
    app = create_app()
    
    with app.app_context():
        try:
            print("Agregando columnas mes y anio a la tabla asientos_contables...")
            
            # Verificar si las columnas ya existen
            with db.engine.connect() as connection:
                result = connection.execute(text("SHOW COLUMNS FROM asientos_contables LIKE 'mes'"))
                if result.fetchone():
                    print("La columna 'mes' ya existe")
                else:
                    connection.execute(text("ALTER TABLE asientos_contables ADD COLUMN mes INT"))
                    connection.commit()
                    print("Columna 'mes' agregada")
                
                result = connection.execute(text("SHOW COLUMNS FROM asientos_contables LIKE 'anio'"))
                if result.fetchone():
                    print("La columna 'anio' ya existe")
                else:
                    connection.execute(text("ALTER TABLE asientos_contables ADD COLUMN anio INT"))
                    connection.commit()
                    print("Columna 'anio' agregada")
                
                # Actualizar registros existentes
                print("Actualizando registros existentes...")
                connection.execute(text("""
                    UPDATE asientos_contables 
                    SET mes = MONTH(fecha), anio = YEAR(fecha) 
                    WHERE mes IS NULL OR anio IS NULL
                """))
                connection.commit()
                
                # Agregar restricciones NOT NULL
                print("Agregando restricciones NOT NULL...")
                connection.execute(text("ALTER TABLE asientos_contables MODIFY COLUMN mes INT NOT NULL"))
                connection.execute(text("ALTER TABLE asientos_contables MODIFY COLUMN anio INT NOT NULL"))
                connection.commit()
            
            print("✅ Columnas agregadas exitosamente!")
            
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == '__main__':
    add_columns()
