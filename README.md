# 💈 Barbería Denver — System & Booking Platform

[![Frontend Online](https://img.shields.io/badge/Frontend-Firebase_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://barberia-denver.web.app)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Backend Engine](https://img.shields.io/badge/Backend-Fastify_Prisma-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Design Aesthetic](https://img.shields.io/badge/Estética-Fleischer_1930s_B%26W-d61f26?style=for-the-badge)](https://barberia-denver.web.app)

Plataforma web de agendamiento y gestión de citas para **Barbería Denver** (Bogotá, Colombia), diseñada con una estética vintage inspirada en la **caricatura clásica en blanco y negro de los años 30** (estilo Fleischer Studios, Popeye el Marino, Steamboat Willie y Cuphead).

🌐 **Sitio Web En Línea (Frontend):** [https://barberia-denver.web.app](https://barberia-denver.web.app)

---

## 🎨 Sistema de Diseño: Vintage Fleischer 1930s B&W

La interfaz de la aplicación fue desarrollada bajo los más estrictos estándares visuales retro:
- **Paleta Cromática Tinta / Blanco / Grises**: 90% de la interfaz se compone de blanco hueso (`#f5f5f0`), negro profundo (`#0a0a0a`) y grises de tinta (`#141414`, `#b8b8b0`).
- **Acento Circo Vintage (`#d61f26`)**: Reservado exclusivamente para botones de acción principal (CTAs), estados activos y resaltados de marca.
- **Grano de Película & Viñeteado**: Capa de *film grain* interactivo (vía SVG `feTurbulence`) y viñeta radial para simular el encuadre de cine mudo de los años 30.
- **Tipografía Vodevil**: Encabezados potentes con la fuente **Bungee** y cuerpo limpio en **Inter**.
- **Contornos Cómic & Hard Shadows**: Bordes marcados estilo dibujo a mano con sombras duras cuadradas (`box-shadow: 4px 4px 0 #000`).
- **Animaciones Rubber Hose**: Efectos de elasticidad (*squash & stretch*) en interacción con botones y tarjetas.

---

## 🚀 Arquitectura Técnica

El proyecto sigue una estructura de monorepo desacoplado:

```
barber-calendary/
├── frontend/               # Cliente React + Vite (Desplegado en Firebase Hosting)
│   ├── src/
│   │   ├── components/     # UI, componentes de cliente y panel administrador
│   │   ├── pages/          # Vistas (Inicio, Servicios, Reserva, Perfil, Admin)
│   │   ├── contexts/       # Autenticación con Firebase Auth & Google
│   │   ├── store/          # Estado global de reserva con Zustand
│   │   └── index.css       # Sistema de diseño CSS vintage B&W
│   ├── firebase.json       # Configuración de Firebase Hosting
│   └── .firebaserc         # Proyecto Firebase (barberia-denver)
├── backend/                # API REST Fastify (Listo para Render)
│   ├── prisma/             # Schema y migraciones de PostgreSQL (Neon.tech)
│   ├── src/
│   │   ├── routes/         # Endpoints (Servicios, Citas, Barberos, Reseñas, Auth)
│   │   └── services/       # Lógica de negocio y conexión a Prisma / Firebase Admin
│   └── Dockerfile          # Multi-stage Docker build para producción
└── render.yaml             # Render Blueprint para despliegue automatizado del Backend
```

### Tecnologías Clave

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Zustand, TanStack React Query, Lucide Icons, Firebase Auth (Google Sign-In).
- **Backend**: Node.js, Fastify v5, Prisma ORM v7, Zod Validation, Firebase Admin SDK, JWT.
- **Base de Datos**: PostgreSQL alojado en **Neon.tech** con *Connection Pooling* activado.
- **Hosting**: Firebase Hosting (Frontend) & Render (Backend).

---

## 🐘 Estado de la Base de Datos (Neon PostgreSQL)

La base de datos se encuentra **100% activa y sincronizada en Neon.tech**.

- **Host Pooler**: `ep-shy-cherry-ayj76f4o-pooler.c-5.us-east-2.aws.neon.tech`
- **Nombre de Base de Datos**: `neondb`
- **Estado de Migraciones**: Al día (`Database schema is up to date!`).

### Modelos Principales del Schema Prisma:
1. `Usuario`: Clientes, Barberos y Administradores (vinculados a Firebase UID).
2. `Barbero`: Perfil profesional, especialidades y foto.
3. `Servicio`: Cortes, Barba, Combos y Precios en COP.
4. `Cita`: Reservas con fecha, hora, barbero, servicio y estado (`CONFIRMADA`, `COMPLETADA`, `CANCELADA`).
5. `Resena`: Calificaciones de 1 a 5 estrellas con comentario.
6. `HorarioBarbero`: Disponibilidad horaria por día de la semana.

---

## ⚡ Despliegue del Backend en Render

El backend está preparado para desplegarse en **Render** en cuestión de minutos.

### Opción A: Despliegue Automático con `render.yaml` (Recomendado)
1. Conecta tu repositorio de GitHub `ksebas20500/barber-calendary` en [Render Dashboard](https://dashboard.render.com).
2. Selecciona **Blueprints** -> **New Blueprint Instance**.
3. Render detectará el archivo `render.yaml` y creará el servicio web automáticamente.
4. Completa las siguientes Variables de Entorno en el panel de Render:
   - `DATABASE_URL`: Tu cadena de conexión de Neon PostgreSQL.
   - `FIREBASE_CLIENT_EMAIL`: Email del Service Account de Firebase.
   - `FIREBASE_PRIVATE_KEY`: Clave privada del Service Account de Firebase.

### Opción B: Despliegue Manual como Web Service
1. En Render, crea un nuevo **Web Service** conectado a tu repo.
2. Configuración del servicio:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start`
3. Agrega las variables de entorno:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://neondb_owner:npg_d8xgoZpELe1H@ep-shy-cherry-ayj76f4o-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   CORS_ORIGIN=https://barberia-denver.web.app
   FIREBASE_PROJECT_ID=barberia-denver
   FIREBASE_CLIENT_EMAIL=tu_service_account@barberia-denver.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   JWT_SECRET=tu_secreto_super_seguro
   ```

---

## 💻 Ejecución Local

### Prerrequisitos
- Node.js >= 20.x
- npm >= 10.x

### 1. Clonar e Instalar Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
El servidor backend iniciará en `http://localhost:3001`.

### 2. Instalar y Ejecutar Frontend
```bash
cd ../frontend
npm install
npm run dev
```
El frontend iniciará en `http://localhost:5173`.

---

## 📤 Despliegue del Frontend a Firebase Hosting

Para subir cambios futuros en el frontend a Firebase Hosting:
```bash
cd frontend
npm run build
npx firebase-tools deploy --only hosting
```

---

## 📜 Licencia y Derechos

© 2026 Barbería Denver. Todos los derechos reservados. Desarrollado con precisión retro y tecnología moderna.
