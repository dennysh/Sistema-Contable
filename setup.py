#!/usr/bin/env python3
"""
Script de configuración para el Sistema Contable
Este script ayuda a configurar el entorno de desarrollo
"""

import os
import sys
import subprocess
import mysql.connector
from mysql.connector import Error

def check_python_version():
    """Verifica que la versión de Python sea compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Se requiere Python 3.8 o superior")
        print(f"Versión actual: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detectado")
    return True

def check_node_version():
    """Verifica que Node.js esté instalado"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()} detectado")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Error: Node.js no está instalado")
    print("Por favor instala Node.js desde https://nodejs.org/")
    return False

def check_mysql_connection():
    """Verifica la conexión a MySQL"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=input("Ingresa la contraseña de MySQL (o presiona Enter si no tienes): ")
        )
        
        if connection.is_connected():
            print("✅ Conexión a MySQL exitosa")
            connection.close()
            return True
    except Error as e:
        print(f"❌ Error conectando a MySQL: {e}")
        return False

def create_database():
    """Crea la base de datos del sistema"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=input("Ingresa la contraseña de MySQL: ")
        )
        
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS sistema_contable")
        print("✅ Base de datos 'sistema_contable' creada")
        
        cursor.close()
        connection.close()
        return True
    except Error as e:
        print(f"❌ Error creando la base de datos: {e}")
        return False

def create_env_file():
    """Crea el archivo .env con configuración básica"""
    env_content = """# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_contable

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Archivo .env creado")
    print("⚠️  Recuerda actualizar la contraseña de MySQL en el archivo .env")

def install_python_dependencies():
    """Instala las dependencias de Python"""
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencias de Python instaladas")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias de Python: {e}")
        return False

def install_node_dependencies():
    """Instala las dependencias de Node.js"""
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Dependencias de Node.js instaladas")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias de Node.js: {e}")
        return False

def main():
    """Función principal de configuración"""
    print("🚀 Configurando Sistema Contable...")
    print("=" * 50)
    
    # Verificar requisitos
    if not check_python_version():
        return False
    
    if not check_node_version():
        return False
    
    # Crear archivo .env
    create_env_file()
    
    # Crear base de datos
    if not create_database():
        return False
    
    # Instalar dependencias
    print("\n📦 Instalando dependencias...")
    if not install_python_dependencies():
        return False
    
    if not install_node_dependencies():
        return False
    
    print("\n✅ Configuración completada exitosamente!")
    print("\n📋 Próximos pasos:")
    print("1. Actualiza la contraseña de MySQL en el archivo .env")
    print("2. Ejecuta el backend: python backend/app.py")
    print("3. En otra terminal, ejecuta el frontend: npm start")
    print("4. Abre http://localhost:3000 en tu navegador")
    
    return True

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Configuración cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
