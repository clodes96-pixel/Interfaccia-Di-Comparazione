#!/bin/bash

# Comparatore Psicofarmaci - Start Script
# Questo script avvia l'applicazione automaticamente

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Avvio Comparatore Psicofarmaci..."

# Controlla se node_modules esiste
if [ ! -d "node_modules" ]; then
  echo "📦 Installiamo le dipendenze..."
  npm install
fi

# Ottieni il numero di porta disponibile (di solito 5173)
PORT=5173
echo ""
echo "🌐 L'app sarà disponibile su:"
echo "   ➜  Local:   http://localhost:$PORT/Interfaccia-Di-Comparazione/"
echo "   ➜  Network: http://0.0.0.0:$PORT/Interfaccia-Di-Comparazione/"
echo ""
echo "✨ Premi Ctrl+C per fermare il server"
echo ""

# Avvia il dev server
npm run dev -- --host 0.0.0.0
