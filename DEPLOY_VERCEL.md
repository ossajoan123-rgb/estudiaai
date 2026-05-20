# Deploy EstudiaAI en Vercel

## 1. Base de datos
1. Crear una base de datos PostgreSQL en Neon.
2. Copiar el DATABASE_URL.

## 2. Variables de entorno en Vercel
Agregar:

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://tu-app.vercel.app
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
NEXT_PUBLIC_APP_NAME=EstudiaAI

## 3. Google Login
En Google Cloud Console:
- Authorized JavaScript origins:
  https://tu-app.vercel.app
- Authorized redirect URIs:
  https://tu-app.vercel.app/api/auth/callback/google

## 4. Deploy
1. Subir proyecto a GitHub
2. Importar repositorio en Vercel
3. Agregar variables de entorno
4. Deploy

## 5. Prisma
Ejecutar:

npx prisma db push

## 6. Funciones IA
La IA usa GPT-4.1-mini y puede:
- leer materias
- analizar hábitos
- revisar tareas
- recomendar estudio
- asesorar emocionalmente
