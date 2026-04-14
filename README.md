<p align="center">
  <h1 align="center">🚀 CareerOps: The Golden Master</h1>
  <p align="center">
    <strong>El ecosistema CRM definitivo para potenciar la búsqueda de empleo. MERN Stack + Extension Quirúrgica.</strong>
  </p>
</p>

---

## 📖 Visión General
**CareerOps** no es un simple gestor de tareas; es un ecosistema operativo diseñado para candidatos que tratan su búsqueda de empleo como un proceso de ventas B2B. A través de un tablero Kanban en la nube, métricas de mejora diaria y un potente "*Clipper*" (Extensión de Chrome), puedes sincronizar vacantes de LinkedIn a tu cuenta en 1 clic.

---

## 🏗️ Arquitectura Técnica "Neon Pro"

El proyecto se compone de 3 piezas centrales profundamente enlazadas que garantizan un flujo en tiempo real (Sincronización `localStorage` a `chrome.storage.local`):

### 1. El Backend (Motor de Lógica y Seguridad)
Construido en **Node.js** con **Express** y **MongoDB**, el backend sirve como la bóveda inexpugnable de tus datos:
- 🛡️ **Defensa Anti-Mass Assignment:** Filtrado riguroso por lista blanca en cada inyección de datos.
- 🔐 **Seguridad Row-Level:** Todas las operaciones (lectura/escritura/eliminación) están ancladas al JWT del `userId` específico.
- 🌐 **CORS Dinámico:** Preparado para aceptar peticiones tanto desde entornos web (`localhost`) como desde identificadores seguros de extensiones Chrome (`chrome-extension://`).

### 2. El Frontend (Dashboard React/Vite)
Tablero web con una estética *premium* y un manejo de dependencias reactivas ultrarrápido:
- 🎯 **Smart Fusion Tracker:** Control unificado de tareas macro-diarias y gestión de vacantes.
- ⚡ **Rendimiento SPA:** Cero recargas de página, con notificaciones asíncronas y *optimistic UI*.

### 3. CareerOps Clipper (The Bridge)
Una extensión de Google Chrome que inyecta código directamente sobre el DOM de LinkedIn para recolectar inteligencia:
- 🧠 **Heurística de Scrapeo:** El algoritmo `isLikelyJobTitle` destila inteligentemente Puestos/Cargos evadiendo los clásicos fallos de leer "Reclutador" o "Manager".
- 🏓 **Protocolo Ping-Pong:** Asegura canales activos sin dejar caer las promesas asíncronas frente a las tácticas Single Page de LinkedIn.
- 🔌 **Sincronización "Just-In-Time":** Verifica credenciales milisegundos antes del guardado para asegurar que los registros vayan a la Sesión Activa del momento.

---

## 🛠️ Cómo Desplegar para una Prueba (Local)

Sigue estos pasos para arrancar el ecosistema en tu propia máquina.

### Requisitos Previos:
- Node.js (v18+)
- Cuenta o Instancia local de MongoDB
- Navegador Google Chrome

### Paso 1: Configurar el Backend (Puerto 5000)
1. Navega a la carpeta `/backend`.
2. Ejecuta `npm install`.
3. Crea un archivo `.env` en la raíz de `/backend` con:
   ```env
   PORT=5000
   MONGO_URI=tu_cadena_de_conexion_de_mongo
   JWT_SECRET=tu_secreto_super_seguro
   FRONTEND_URL=http://localhost:5174
   ```
4. Levanta el servidor con `npm run dev`.

### Paso 2: Configurar el Frontend (Puerto 5174)
1. Abre una nueva terminal y dirígete a `/frontend`.
2. Ejecuta `npm install`.
3. Crea un archivo `.env` en la raíz de `/frontend` con:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Levanta el servidor con `npm run dev`. Entra y regístrate para generar tu primer tablero.

### Paso 3: Instalar el Clipper (Extensión)
1. En Google Chrome, escribe `chrome://extensions/` en la URL.
2. Activa el **Modo Desarrollador** (Esquina superior derecha).
3. Haz clic en **"Cargar descomprimida"** (Load unpacked) y selecciona la carpeta `/extension` de este repositorio.
4. Ancla la extensión en tu navegador.
5. Inicia sesión en la Web de CareerOps. El puente (`bridge.js`) sincronizará tu sesión en la extensión de forma automática.

> 🌟 **¡Ve y Pruébalo!** Abre una vacante en LinkedIn, haz click en el Clipper y envía la oferta a tu KanBan mágico.
