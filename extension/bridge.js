// bridge.js - Inyectado en tu Web App de CareerOps (localhost:5173/5174)
console.log("🚀 CareerOps Bridge: Activado.");

// 1. Sincronización proactiva al cargar
const syncToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        chrome.storage.local.set({ token }, () => {
            console.log("✅ CareerOps Bridge: Token sincronizado.");
        });
    } else {
        // Si no hay token en localStorage, lo limpiamos también en la extensión
        chrome.storage.local.remove('token', () => {
            console.log("🧹 CareerOps Bridge: Sesión limpia en extensión.");
        });
    }
};

syncToken();

// 2. Escuchar cambios en el storage (Login/Logout en tiempo real)
window.addEventListener('storage', (e) => {
    if (e.key === 'token') {
        console.log("🔄 CareerOps Bridge: Detectado cambio de sesión en la Web.");
        syncToken();
    }
});

// 3. Intervalo de seguridad (Opcional, pero previene desincronización por SPAs)
setInterval(syncToken, 5000);
