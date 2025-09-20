#!/bin/bash

echo "Iniciando Sistema Contable..."
echo

echo "Iniciando Backend (Flask)..."
gnome-terminal -- bash -c "cd $(pwd) && python backend/app.py; exec bash" &

echo "Esperando 3 segundos..."
sleep 3

echo "Iniciando Frontend (React)..."
gnome-terminal -- bash -c "cd $(pwd) && npm start; exec bash" &

echo
echo "Sistema iniciado!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
