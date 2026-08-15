#!/bin/bash

# Comparatore Psicofarmaci - macOS App Launcher
# Doppio clic questo file per avviare l'applicazione

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧠 COMPARATORE PSICOFARMACI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Controlla se node_modules esiste
if [ ! -d "node_modules" ]; then
  echo "📦 Prima volta? Installiamo le dipendenze..."
  npm install
  echo ""
fi

PORT=5173
echo "🚀 Avvio dell'applicazione..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ L'app è pronta!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Apri nel browser:"
echo "  🌐 http://localhost:$PORT/Interfaccia-Di-Comparazione/"
echo ""
echo "Oppure usa questa URL dal tuo dispositivo:"
echo "  📱 http://$(hostname -I | awk '{print $1}'):$PORT/Interfaccia-Di-Comparazione/"
echo ""
echo "Per fermare: premi Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev -- --host 0.0.0.0
