#!/usr/bin/env python3
"""
Script para limpiar archivos de prueba
"""

import os

def cleanup_test_files():
    """Eliminar archivos de prueba"""
    test_files = [
        'test_counters.html',
        'backend/add_columns.py',
        'cleanup_test.py'
    ]
    
    for file in test_files:
        if os.path.exists(file):
            os.remove(file)
            print(f"✅ Archivo {file} eliminado")
        else:
            print(f"⚠️  Archivo {file} no encontrado")

if __name__ == '__main__':
    cleanup_test_files()
    print("🧹 Limpieza completada")
