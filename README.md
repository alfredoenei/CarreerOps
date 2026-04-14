# 🚀 CareerOps | The Ultimate Job Search CRM

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

## 🔗 Overview / Resumen
Plataforma Full-Stack (MVP) para gestionar de forma estratégica y analítica tu búsqueda de empleo. Diseñada con una arquitectura robusta, CareerOps integra un frontend Kanban interactivo, un backend seguro y una extensión de Chrome de extracción de datos de última generación para capturar oportunidades laborales en tiempo real.

[English Version Below](#english-version)

---

## 🇪🇸 Versión en Español

### 🚀 El Proyecto
**CareerOps** es un CRM personal avanzado para candidatos de élite. Combina la eficiencia de un sistema de seguimiento **Kanban** con un **Clipper (Extensión de Chrome)** automatizado. En lugar de copiar y pegar manualmente datos de ofertas o reclutadores, el sistema extrae e inyecta oportunidades directamente a tu base de datos de manera segura y sincronizada.

### ✨ Características Destacadas
- **LinkedIn Hybrid Scraper (Clipper)**: Ruta de extracción inteligente capaz de evadir IDs hardcodeados en el DOM dinámico de LinkedIn.
- **Sincronización "Ping-Pong"**: Protocolo de comunicación en tiempo real entre la extensión y la sesión web activa para inyección de datos "Just In Time".
- **Kanban Drag & Drop**: Gestión fluida de aplicaciones, desde el descubrimiento hasta la oferta final.
- **Métricas de Racha (Daily Tracker)**: Gamificación del proceso de búsqueda de empleo mediante seguimiento de objetivos y rachas de actividad.
- **Arquitectura Segura y CORS Dinámico**: El backend protege las rutas con JWT y contiene políticas CORS dinámicas que solo autorizan solicitudes de la aplicación web y la ID de la extensión validada.

### 🛠️ Stack Tecnológico & Arquitectura
- **Frontend**: React 19 + Vite, Drag & Drop nativo.
- **Backend**: Node.js & Express, JWT Authentication.
- **Base de Datos**: MongoDB & Mongoose.
- **Extensión de Browser**: Manifest V3, Web Scraping Híbrido & Chrome Runtime APIs.

### 📦 Instalación Rápida

1. **Instalar Dependencias**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configuración de Entorno** (`backend/.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/careerops
   JWT_SECRET=tu_secreto_aqui
   PORT=5000
   ```

3. **Ejecución del Cliente y Servidor**:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

4. **Instalación del Clipper (Modo Unpacked)**:
   - Abre Google Chrome y ve directamente a `chrome://extensions/`.
   - Activa el **"Modo de desarrollador"** (Developer mode) en la parte superior derecha.
   - Haz clic en **"Cargar descomprimida"** (Load unpacked).
   - Elige y selecciona la carpeta `./extension` que está en la raíz de este repositorio.

---

## 🇺🇸 English Version

### 🚀 The Project
**CareerOps** is an advanced personal CRM built for ambitious job seekers. As a minimum viable product (MVP), it unites the efficiency of a **Kanban** board tracker with an automated **Chrome Extension Clipper**. Instead of manually copy-pasting job details, the Clipper securely scrapes and injects career opportunities directly into your dashboard.

### ✨ Key Features
- **Hybrid Scraper Logic**: Intelligent data extraction capable of evading obfuscated and deeply nested DOM elements on platforms like LinkedIn.
- **"Ping-Pong" Protocol**: A synchronized, real-time message passing structure connecting the background worker directly to the frontend's live session.
- **Interactive Kanban**: Fluid Drag & Drop interface to monitor application statuses flawlessly.
- **Streak Tracker**: Advanced metrics dashboard for measuring your daily goals and consistency over time.

### 🛠️ Tech Stack
- **Frontend**: React & Vite.
- **Backend**: Express.js with Dynamic CORS & JWT validations.
- **Database**: MongoDB Atlas / Mongoose.
- **Browser Ext**: Chrome Service Workers API.

---

## 👤 Contacto / Contact
Desarrollado y estructurado por **Alf**
- [LinkedIn](https://www.linkedin.com/in/alfredo-enei-61b61034b)
- [GitHub](https://github.com/alfredoenei)

> [!IMPORTANT]
> **Resilient Engineering**: The Chrome Extension is specifically engineered with hybrid fallback mechanisms to prevent breakage when professional networks update their internal class name architectures.

---
*CareerOps - Engineering your next career move.*
