#!/bin/bash
# setup.sh — EstudiaAI quick setup script

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       EstudiaAI — Setup Script       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no encontrado. Instala Node.js 18+ desde https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Se requiere Node.js 18+. Versión actual: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Install dependencies
echo ""
echo "📦 Instalando dependencias..."
npm install

# Check .env
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "⚠️  Archivo .env creado desde .env.example"
  echo "   IMPORTANTE: Edita .env con tus credenciales antes de continuar"
  echo ""
  echo "   Variables requeridas:"
  echo "   - DATABASE_URL (PostgreSQL)"
  echo "   - NEXTAUTH_SECRET (genera con: openssl rand -base64 32)"
  echo "   - NEXTAUTH_URL (http://localhost:3000 para desarrollo)"
  echo ""
  read -p "¿Ya configuraste el .env? (s/n): " CONFIRM
  if [ "$CONFIRM" != "s" ]; then
    echo "Edita .env y vuelve a ejecutar este script"
    exit 0
  fi
fi

# Generate Prisma client
echo ""
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Push DB schema
echo ""
echo "🗃  Sincronizando base de datos..."
npx prisma db push

# Ask about seed
echo ""
read -p "¿Cargar datos de ejemplo? (s/n): " SEED
if [ "$SEED" = "s" ]; then
  echo "🌱 Cargando datos de ejemplo..."
  npm run db:seed
  echo ""
  echo "   📧 Usuario demo: demo@estudiaai.com"
  echo "   🔑 Contraseña:   demo123456"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║          ¡Todo listo! 🚀             ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Ejecuta: npm run dev"
echo "Abre:    http://localhost:3000"
echo ""
