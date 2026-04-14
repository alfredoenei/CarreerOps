document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const titleInput = document.getElementById('title');
  const companyInput = document.getElementById('company');
  const salaryInput = document.getElementById('salary');
  const loadingOverlay = document.getElementById('loadingOverlay');

  let window_scrapedData = null;
  let isFavorite = false;
  let config_boardId = null;
  let config_columnId = null;

  const favBtn = document.getElementById('favBtn');
  favBtn.addEventListener('click', () => {
    isFavorite = !isFavorite;
    favBtn.classList.toggle('active', isFavorite);
  });

  // 🏓 PROTOCOLO DE CONECTIVIDAD (PING-PONG)
  async function pingWithTimeout(tabId, timeout = 1000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve({ success: false, reason: "timeout" }), timeout);
      
      chrome.tabs.sendMessage(tabId, { action: "ping" }, (response) => {
        clearTimeout(timer);
        if (chrome.runtime.lastError) {
          resolve({ success: false, reason: "no_listener" });
        } else {
          resolve({ success: true, ...response });
        }
      });
    });
  }

  async function initializeClipper() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0] || !tabs[0].url.includes('linkedin.com')) {
        handleFailure("⚠️ Visita una vacante en LinkedIn");
        return;
      }

      const activeTab = tabs[0];

      // 0. Fetch config (Board, Column, Email)
      chrome.storage.local.get('token').then(({ token }) => {
        if (!token) {
          console.log("❌ Setup Error: Token ausente");
          btn.disabled = true;
          btn.innerText = "⚠️ Abre CareerOps Web primero";
          return;
        }
        
        fetch(`${API_BASE_URL}/api/user/setup`, {
          headers: { 'x-auth-token': token }
        })
        .then(res => {
          if (res.status === 401 || res.status === 403) throw new Error("AUTH_EXPIRED");
          if (!res.ok) throw new Error(`HTTP_${res.status}`);
          return res.json();
        })
        .then(data => {
          config_boardId = data.boardId;
          config_columnId = data.columnId;
          
          // Mostrar sesión del usuario
          const sessionBar = document.getElementById('sessionBar');
          const userEmail = document.getElementById('userEmail');
          if (sessionBar && userEmail && data.email) {
            userEmail.innerText = data.email;
            sessionBar.style.display = 'flex';
          }
          
          console.log("✅ Setup OK:", data.email);
        })
        .catch(e => {
          console.error("❌ Setup Error:", e.message);
          if (e.message === "AUTH_EXPIRED") {
            handleSessionExpired();
          } else {
            status.innerHTML = `❌ <span class='error'>Error de conexión (${e.message})</span>`;
            btn.disabled = true;
          }
        });
      });

      // 1. Iniciar Scraping...
      let conn = await pingWithTimeout(activeTab.id, 500);

      if (!conn.success) {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        });
        await new Promise(r => setTimeout(r, 200));
        conn = await pingWithTimeout(activeTab.id, 1000);
      }

      if (conn.success) {
        await new Promise(r => setTimeout(r, 250));
        const requestScrape = () => new Promise(resolve => {
            chrome.tabs.sendMessage(activeTab.id, { action: "scrapeLinkedIn" }, resolve);
        });

        let response = await requestScrape();
        if (response && response.success && response.title && response.title.includes('(')) {
            await new Promise(r => setTimeout(r, 350));
            response = await requestScrape();
        }

        if (response && response.success) {
          displayData(response);
        } else {
          handleFailure("⚠️ No se pudo extraer datos automáticamente.");
        }
      } else {
        handleFailure("⚠️ Canal fallido. Edición manual habilitada.");
      }
    } catch (err) {
      console.error("❌ Clipper Error:", err);
      handleFailure("❌ Error crítico de extensión.");
    }
  }

  function handleSessionExpired() {
    chrome.storage.local.remove('token');
    status.innerHTML = "❌ <span class='error'>Sesión expirada. Entra en la Web.</span>";
    btn.disabled = true;
    btn.innerText = "BLOQUEADO";
    document.getElementById('sessionBar').style.display = 'none';
  }

  function displayData(data) {
    titleInput.value = data.title || "";
    companyInput.value = data.company || "";
    salaryInput.value = data.salary || "";
    window_scrapedData = data;
    unlockForm("🚀 Datos listos. ¿Guardamos?");
  }

  function handleFailure(message) {
    status.innerHTML = `${message}<br/><span style="font-size: 10px; color: #fbbf24; font-weight: 600; display: block; margin-top: 6px;">💡 Tip: <b id="refreshPageTip" style="cursor: pointer; text-decoration: underline;">Actualizar navegador</b> si no cargan las ofertas.</span>`;
    unlockForm();
  }

  function unlockForm(msg) {
    if (msg) status.innerText = msg;
    loadingOverlay.classList.remove('skeleton');
    titleInput.readOnly = false;
    companyInput.readOnly = false;
    salaryInput.readOnly = false;
    
    const currentText = btn.innerText.toUpperCase();
    if (currentText.includes("ENVIAR") || currentText === "") {
        btn.disabled = false;
    }
  }

  // Inicialización
  initializeClipper();

  // 💾 Guardar en Backend (PROACTIVO)
  btn.addEventListener('click', async () => {
    const { token } = await chrome.storage.local.get('token');
    if (!token) {
      status.innerHTML = "❌ <span class='error'>Sin sesión.</span> Abre CareerOps.";
      return;
    }
    
    btn.innerText = "COORDINANDO...";
    btn.disabled = true;

    try {
      // 🔄 Sync previo al envío
      const setupRes = await fetch(`${API_BASE_URL}/api/user/setup`, {
        headers: { 'x-auth-token': token }
      });

      if (setupRes.status === 401 || setupRes.status === 403) {
        handleSessionExpired();
        return;
      }

      if (setupRes.ok) {
        const data = await setupRes.json();
        config_boardId = data.boardId;
        config_columnId = data.columnId;
      }

      if (!config_boardId || !config_columnId) {
        status.innerHTML = "❌ <span class='error'>Configuración incompleta.</span>";
        return;
      }

      const activeTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
      const payload = {
        title: titleInput.value,
        company: companyInput.value,
        salary: salaryInput.value,
        location: window_scrapedData?.location || "Remoto",
        jobUrl: window_scrapedData?.jobUrl || activeTab.url,
        columnId: config_columnId, 
        boardId: config_boardId,
        position: 0,
        priority: "medium",
        isFavorite: isFavorite
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        return;
      }

      if (response.ok) {
        status.innerHTML = "<span class='success'>✅ ¡Enviado al Tablero!</span>";
        setTimeout(() => window.close(), 1200);
      } else {
        const errData = await response.json().catch(() => ({}));
        status.innerHTML = `❌ <span class='error'>Error API (${response.status})</span>`;
        console.error("API Error:", errData);
      }
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'Tiempo agotado (4s)' : 'Error de red';
      status.innerHTML = `❌ <span class='error'>${msg}</span>`;
    } finally {
      // 🛡️ RESET ETERNO: El botón siempre vuelve a la vida tras 2.5s si no se cerró la ventana
      setTimeout(() => {
        if (btn.innerText !== "ENVIAR A TABLERO") {
            btn.innerText = "ENVIAR A TABLERO";
            btn.disabled = false;
        }
      }, 2500);
    }
  });

  // 🚪 Lógica de Logout Discreto
  document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'logoutBtn') {
      if (confirm("¿Cerrar sesión en el Clipper?")) {
        await chrome.storage.local.remove('token');
        window.close();
      }
    }
    
    // Tip de refresco
    if (e.target && e.target.id === 'refreshPageTip') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    }
  });
});
