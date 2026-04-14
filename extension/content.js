/**
 * CONTENT SCRIPT - LinkedIn Scraper (Bulletproof Handshake Edition)
 * Este script ahora soporta el protocolo Ping-Pong para asegurar conectividad.
 */
if (typeof window.careerOpsLoaded === 'undefined') {
  window.careerOpsLoaded = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 🏓 HANDSHAKE: Responder al ping para confirmar que el script está vivo
    if (request.action === "ping") {
      console.log("🏓 CareerOps: Pong recibido.");
      sendResponse({ success: true, pong: true });
      return false; // Respuesta síncrona, no hace falta mantener el canal abierto
    }

    if (request.action === "scrapeLinkedIn") {
      console.log("🔍 Forced Scraper: Analizando vacante...");
      
      try {
        const cleanup = (str) => typeof str === 'string' ? str.replace(/\n/g, '').trim() : String(str).trim();

        // --- 🎯 HEURÍSTICA DE PUESTOS ---
        const isLikelyJobTitle = (text) => {
            if (!text) return false;
            const techKeys = ['dev', 'eng', 'manager', 'analyst', 'lead', 'senior', 'junior', 'fullstack', 'front', 'back', 'desarrollador', 'arquitecto', 'consultor', 'programador', 'técnico'];
            const forbiddenKeys = ['hiring', 'recruiter', 'contact', 'persona', 'hablar', 'manager de contratación'];
            const normalized = text.toLowerCase();
            
            if (forbiddenKeys.some(k => normalized.includes(k))) return false;
            if (techKeys.some(k => normalized.includes(k))) return true;

            const words = text.trim().split(/\s+/);
            const isNamePattern = words.length >= 2 && words.length <= 4 && words.every(w => /^[A-ZÁÉÍÓÚ]/.test(w));
            return !isNamePattern;
        };

        // --- 🏢 AISLAMIENTO DE CONTENEDORES ---
        const topCard = document.querySelector('.job-details-jobs-unified-top-card') || document.querySelector('.jobs-unified-top-card__content--left');
        
        let titleElements = [];
        if (topCard) {
            titleElements = Array.from(topCard.querySelectorAll('h1, h2, .job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title'));
        } else {
            titleElements = Array.from(document.querySelectorAll('h1.t-24, .jobs-details-top-card__job-title'));
        }

        let title = "";
        for (const el of titleElements) {
            const val = cleanup(el.innerText);
            if (val && isLikelyJobTitle(val)) {
                title = val;
                break;
            }
        }

        if (!title) {
            title = cleanup(document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || document.title.split('|')[0]);
        }

        let company = 
          topCard?.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText ||
          document.querySelector('._30395a02.b8088849._9989f0b4')?.innerText || // Selectores ofuscados
          document.querySelector('.jobs-unified-top-card__company-name')?.innerText ||
          document.querySelector('.jobs-details-top-card__company-name')?.innerText ||
          document.querySelector('.job-details-jobs-secondary-focus-top-card__company-name')?.innerText ||
          document.querySelector('.jobs-details-top-card__subtitle-item')?.innerText ||
          document.querySelector('.jobs-unified-top-card__company-name a')?.innerText ||
          document.querySelector('div.mt2 span.t-14')?.innerText ||
          "Empresa no detectada";

        // Fallback estructural: Buscar el primer link de compañía
        if (!company || company === "Empresa no detectada") {
            const companyLinks = Array.from(document.querySelectorAll('a[href*="/company/"]'));
            const textLink = companyLinks.find(a => a.innerText.trim().length > 0 && !a.querySelector('img'));
            if (textLink) {
              const cleanedText = textLink.innerText.trim().split('\n')[0];
              if (cleanedText) company = cleanedText; // Bug original arreglado: ahora asigna a 'company', no a 'title'
            }
        }

        const recruiterSection = document.querySelector('.jobs-poster') || document.querySelector('.jobs-hiring-person');
        let recruiterName = recruiterSection?.querySelector('.jobs-poster__name, .t-16.t-black.t-bold')?.innerText || "";
        
        if (recruiterName) {
            console.log("👤 Reclutador detectado:", cleanup(recruiterName));
        }

        const salary = 
          topCard?.querySelector('.job-details-jobs-unified-top-card__salary-info')?.innerText ||
          "No especificado";

        const location = 
          topCard?.querySelector('.job-details-jobs-unified-top-card__bullet')?.innerText ||
          document.querySelector('.jobs-details-top-card__bullet')?.innerText ||
          "Remoto / No indicado";

        sendResponse({
          title: cleanup(title),
          company: cleanup(company),
          salary: cleanup(salary),
          location: cleanup(location),
          recruiterName: cleanup(recruiterName),
          jobUrl: window.location.href,
          success: true
        });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
      return false;
    }
    return false; // Por defecto no mantener abierto
  });

  console.log("✅ CareerOps: Content Script listo con soporte Handshake.");
} else {
  console.log("🔄 CareerOps: Guard activo, canal ya habilitado.");
}