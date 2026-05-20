# 📚 EstudiaAI — Plataforma Académica Inteligente

> Tu compañero académico inteligente. Mejora tu rendimiento, hábitos y bienestar emocional con IA personalizada.

![EstudiaAI](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)

---

## ✨ Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| 🏠 **Dashboard** | Resumen personalizado con KPIs, gráficas de bienestar y tareas |
| 📚 **Académico** | Gestión de materias, notas, ponderaciones y cálculo automático |
| 🎯 **Hábitos** | Tracker de hábitos con rachas, calendario y estadísticas |
| 💚 **Bienestar** | Check-ins emocionales diarios con tendencias y recomendaciones |
| ✨ **Recomendaciones** | Motor de sugerencias IA basado en tu perfil completo |
| 🧭 **Onboarding** | Cuestionario interactivo que genera tu perfil académico |

---

## 🛠 Stack tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL + Prisma ORM
- **Autenticación:** NextAuth v5 (Google + Credenciales)
- **Estilos:** TailwindCSS + CSS Variables
- **Animaciones:** Framer Motion
- **Gráficas:** Recharts
- **Notificaciones:** Sonner
- **Deploy:** Vercel (listo para producción)

---

## 🚀 Instalación local

### Requisitos previos
- Node.js 18+
- PostgreSQL (local o en la nube)
- pnpm / npm / yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/estudia-ai.git
cd estudia-ai
```

### 2. Instalar dependencias
```bash
npm install
# o
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/estudiaai"

# NextAuth (genera con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu-secreto-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional - crea en console.cloud.google.com)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar la base de datos
```bash
# Crear las tablas
npx prisma db push

# O con migraciones (recomendado para producción)
npx prisma migrate dev --name init
```

### 5. Cargar datos de ejemplo (opcional)
```bash
npm run db:seed
```

Esto crea:
- Usuario demo: `demo@estudiaai.com` / `demo123456`
- 4 materias con notas
- 5 hábitos configurados
- Historial de check-ins
- Recomendaciones de ejemplo

### 6. Iniciar servidor de desarrollo
```bash
npm run dev
```

Visita: http://localhost:3000

---

## ☁️ Deploy en Vercel

### Opción A: Deploy desde GitHub (recomendado)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) y crea un proyecto
3. Conecta tu repositorio
4. Configura las variables de entorno en el panel de Vercel:
   - `DATABASE_URL` (usa Neon, Railway o Supabase para PostgreSQL gratuito)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = `https://tu-dominio.vercel.app`
   - `GOOGLE_CLIENT_ID` (opcional)
   - `GOOGLE_CLIENT_SECRET` (opcional)
5. Deploy automático ✅

### Opción B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Base de datos en producción (opciones gratuitas)
- **[Neon](https://neon.tech)** — PostgreSQL serverless, tier gratuito generoso
- **[Supabase](https://supabase.com)** — PostgreSQL con dashboard, tier gratuito
- **[Railway](https://railway.app)** — Fácil de configurar, $5/mes crédito

### Después del deploy
```bash
# En el panel de Vercel, en "Functions" o localmente con la URL de producción:
npx prisma db push  # o migrate deploy
npm run db:seed     # datos de ejemplo (opcional)
```

---

## 📁 Estructura del proyecto

```
estudia-ai/
├── app/
│   ├── (landing)/
│   │   └── page.tsx           # Landing page
│   ├── auth/
│   │   ├── login/page.tsx     # Login
│   │   └── register/page.tsx  # Registro
│   ├── onboarding/
│   │   └── page.tsx           # Cuestionario de onboarding
│   ├── dashboard/
│   │   ├── layout.tsx         # Layout con sidebar
│   │   └── page.tsx           # Dashboard principal
│   ├── academic/
│   │   └── page.tsx           # Gestión académica
│   ├── habits/
│   │   └── page.tsx           # Tracker de hábitos
│   ├── wellness/
│   │   └── page.tsx           # Bienestar emocional
│   ├── recommendations/
│   │   └── page.tsx           # Recomendaciones IA
│   ├── settings/
│   │   └── page.tsx           # Configuración
│   └── api/
│       ├── auth/              # NextAuth + registro
│       ├── onboarding/        # Procesamiento de onboarding
│       ├── subjects/          # CRUD materias + notas
│       ├── tasks/             # CRUD tareas
│       ├── habits/            # CRUD hábitos + logs
│       ├── checkin/           # Check-ins emocionales
│       └── recommendations/   # Recomendaciones
├── components/
│   ├── landing/               # Secciones de la landing page
│   ├── dashboard/             # Sidebar, TopBar, widgets
│   └── shared/                # Providers y componentes globales
├── lib/
│   ├── prisma.ts              # Cliente Prisma singleton
│   └── utils.ts               # Funciones de utilidad
├── prisma/
│   ├── schema.prisma          # Schema completo de BD
│   └── seed.ts                # Datos de ejemplo
├── auth.ts                    # Configuración NextAuth
├── middleware.ts               # Protección de rutas
└── tailwind.config.ts         # Tokens de diseño
```

---

## 🗃 Esquema de base de datos

El schema incluye las siguientes entidades principales:

- **User** — Perfil completo del estudiante con niveles de riesgo
- **Account / Session** — Autenticación NextAuth
- **OnboardingData** — Respuestas del cuestionario inicial
- **Subject** — Materias con colores, créditos y metas
- **Grade** — Notas con peso, tipo y cálculo automático
- **Task** — Tareas con prioridad, estado y fecha límite
- **Habit** — Hábitos con rachas y frecuencia personalizable
- **HabitLog** — Registro diario de cumplimiento
- **EmotionalCheckin** — Estado emocional diario
- **Recommendation** — Sugerencias generadas por el sistema
- **Achievement** — Logros desbloqueados
- **Notification** — Sistema de notificaciones

---

## 🧪 Cuenta demo

```
Email: demo@estudiaai.com
Contraseña: demo123456
```

---

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- Sesiones JWT firmadas con NEXTAUTH_SECRET
- Validación de inputs con Zod en todas las APIs
- Verificación de ownership en todas las operaciones CRUD
- Variables de entorno para todos los secretos
- Rutas protegidas por middleware

---

## 🎨 Personalización

### Colores de marca
Edita `tailwind.config.ts` y `app/globals.css`:
```css
:root {
  --brand-primary: #6366f1;    /* Indigo - color principal */
  --brand-secondary: #8b5cf6;  /* Violet - secundario */
  --brand-accent: #f59e0b;     /* Amber - acento */
}
```

### Nuevos módulos de IA
Para agregar nuevas recomendaciones, edita `app/api/recommendations/route.ts` y el motor de análisis en `app/api/onboarding/route.ts`.

---

## 📋 Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # ESLint
npm run db:push      # Sincronizar schema con BD
npm run db:migrate   # Crear migración
npm run db:studio    # Abrir Prisma Studio (explorador de BD)
npm run db:seed      # Cargar datos de ejemplo
```

---

## 🚧 Roadmap

- [ ] Notificaciones push (PWA)
- [ ] Temporizador Pomodoro integrado
- [ ] Exportar reportes PDF
- [ ] Modo colaborativo / grupos de estudio
- [ ] Integración con calendarios (Google Calendar)
- [ ] App móvil (React Native / Expo)
- [ ] IA generativa para consejos más detallados

---

## ⚠️ Aviso importante

EstudiaAI es una herramienta de apoyo académico. **No reemplaza** la atención de psicólogos, consejeros académicos ni docentes. Si experimentas problemas serios de salud mental, busca ayuda profesional.

---

## 📄 Licencia

MIT © 2025 EstudiaAI — Hecho con ❤️ para estudiantes latinoamericanos
