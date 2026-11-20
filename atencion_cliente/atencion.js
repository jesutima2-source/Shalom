document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegación exacta según tu árbol de carpetas
    const btnBack = document.getElementById('btnBack');
    const btnProfile = document.getElementById('btnProfile');
  
    // Botón retroceso -> envios/envio.html
    btnBack.addEventListener('click', () => {
      window.location.href = '../envios/envio.html';
    });
  
    // Botón rojo de usuario -> detalles/detalle.html
    btnProfile.addEventListener('click', () => {
      window.location.href = '../detalles/detalle.html';
    });
  
    // 2. Navegación de los 4 botones rápidos
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetRoute = btn.getAttribute('data-route');
        if (targetRoute) {
          window.location.href = targetRoute;
        }
      });
    });
  
    // 3. Control del Modal Interactivo
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const btnCloseModal = document.getElementById('btnCloseModal');
  
    function openModal(title, htmlContent) {
      modalTitle.textContent = title;
      modalBody.innerHTML = htmlContent;
      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
    }
  
    function closeModal() {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
    }
  
    btnCloseModal.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  
    // 4. Botón: Preguntas Frecuentes
    document.getElementById('btnFaq').addEventListener('click', () => {
      openModal(
        'Preguntas frecuentes',
        `
        <div class="faq-item">
          <strong>¿Cuáles son los plazos de entrega?</strong>
          Envíos terrestres entre 24 a 72 horas según destino nacional.
        </div>
        <div class="faq-item">
          <strong>¿Qué documentos necesito para recoger?</strong>
          DNI físico original y el código de seguridad de 4 dígitos.
        </div>
        <div class="faq-item">
          <strong>¿Qué artículos están restringidos?</strong>
          Materiales inflamables, dinero en efectivo, perecibles sin embalaje térmico y sustancias prohibidas por ley.
        </div>
        `
      );
    });
  
    // 5. Botón: Facturación y Comprobantes
    document.getElementById('btnBilling').addEventListener('click', () => {
      openModal(
        'Facturación y comprobantes',
        `
        <p>Ingresa tu número de orden o serie de comprobante para descargar tu PDF:</p>
        <form class="modal-form" id="billingForm">
          <input type="text" class="modal-input" placeholder="Ej. F001-0045892 o N° Orden" required />
          <input type="text" class="modal-input" placeholder="DNI o RUC del titular" required />
          <button type="submit" class="modal-submit">Buscar y descargar comprobante</button>
        </form>
        `
      );
  
      document.getElementById('billingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        modalBody.innerHTML = `
          <div class="faq-item">
            <strong>Comprobante encontrado</strong>
            Tu comprobante electrónico está listo. Se ha iniciado la descarga en formato PDF.
          </div>
        `;
      });
    });
  
    // 6. Botón: Libro de Reclamaciones
    document.getElementById('btnComplaints').addEventListener('click', () => {
      openModal(
        'Libro de reclamaciones',
        `
        <p>Registra una queja o reclamo formal conforme al Código de Protección al Consumidor:</p>
        <form class="modal-form" id="complaintForm">
          <input type="text" class="modal-input" placeholder="N° de Guía / Tracking" required />
          <input type="text" class="modal-input" placeholder="DNI o RUC" required />
          <textarea class="modal-textarea" rows="3" placeholder="Describe el detalle de tu solicitud..." required></textarea>
          <button type="submit" class="modal-submit" style="background:#d97706;">Registrar solicitud</button>
        </form>
        `
      );
  
      document.getElementById('complaintForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const ticket = 'REC-' + Math.floor(100000 + Math.random() * 900000);
        modalBody.innerHTML = `
          <div class="faq-item">
            <strong>Solicitud registrada: ${ticket}</strong>
            Hemos enviado una copia a tu correo. Tiempo máximo de respuesta: 15 días hábiles.
          </div>
        `;
      });
    });
  
    // 7. Botón: Escríbenos por WhatsApp (Número configurado: +51 971101173)
    document.getElementById('btnWhatsapp').addEventListener('click', () => {
      const phone = '51971101173';
      const text = encodeURIComponent('Hola Shalom, necesito ayuda con mi envío.');
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  
    // 8. Botón: Asistente Virtual
    document.getElementById('btnVirtualAssistant').addEventListener('click', () => {
      openModal(
        'Asistente Virtual Shalom',
        `
        <div class="chat-box" id="chatBox">
          <div class="msg-bot">¡Hola! Soy el asistente virtual de Shalom. ¿En qué puedo ayudarte hoy? (Ej: "rastrear", "horarios", "tarifas")</div>
        </div>
        <form class="modal-form" id="chatForm" style="flex-direction:row;">
          <input type="text" id="chatInput" class="modal-input" placeholder="Escribe tu consulta..." required />
          <button type="submit" class="modal-submit" style="background:#d60c23; padding:0 16px;">Enviar</button>
        </form>
        `
      );
  
      const chatBox = document.getElementById('chatBox');
      const chatInput = document.getElementById('chatInput');
  
      document.getElementById('chatForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const userMsg = chatInput.value.trim();
        if (!userMsg) return;
  
        chatBox.innerHTML += `<div class="msg-user">${userMsg}</div>`;
        chatInput.value = '';
  
        let reply = 'Puedo derivarte con un asesor por WhatsApp o ayudarte a cotizar y rastrear tu pedido.';
        const lower = userMsg.toLowerCase();
        if (lower.includes('rastrea') || lower.includes('envio') || lower.includes('envío')) {
          reply = 'Puedes ver el estado en tiempo real ingresando tu código en la sección Rastreo.';
        } else if (lower.includes('horario') || lower.includes('domingo')) {
          reply = 'Atendemos de Lunes a Sábado de 8:00 am a 8:00 pm, y domingos urgentes de 9:00 am a 1:00 pm.';
        } else if (lower.includes('tarifa') || lower.includes('precio') || lower.includes('cotiza')) {
          reply = 'Usa nuestro Cotizador Express en la barra superior para calcular el costo exacto según peso y destino.';
        }
  
        setTimeout(() => {
          chatBox.innerHTML += `<div class="msg-bot">${reply}</div>`;
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 350);
      });
    });
  });