document.addEventListener('DOMContentLoaded', () => {
  // 1. Navegación exacta según tu árbol de carpetas
  const btnBack = document.getElementById('btnBack');
  const btnProfile = document.getElementById('btnProfile');

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.location.href = '../envios/envio.html';
    });
  }

  if (btnProfile) {
    btnProfile.addEventListener('click', () => {
      window.location.href = '../detalles/detalle.html';
    });
  }

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

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // 4. Botón: Preguntas Frecuentes
  document.getElementById('btnFaq')?.addEventListener('click', () => {
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
  document.getElementById('btnBilling')?.addEventListener('click', () => {
    openModal(
      'Facturación y comprobantes',
      `
      <p>Ingresa tu número de orden o serie de comprobante para descargar tu PDF:</p>
      <form class="modal-form" id="billingForm">
        <input type="text" class="modal-input" placeholder="Ej. SHL-873681 o N° Orden" required />
        <input type="text" class="modal-input" placeholder="DNI o RUC del titular" required />
        <button type="submit" class="modal-submit">Buscar y descargar comprobante</button>
      </form>
      `
    );

    document.getElementById('billingForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      modalBody.innerHTML = `
        <div class="faq-item">
          <strong>Comprobante encontrado</strong>
          Tu boleta en formato PDF (115 x 215 mm) está disponible en la sección Comprobante o Rastreo.
        </div>
      `;
    });
  });

  // 6. Botón: Libro de Reclamaciones
  document.getElementById('btnComplaints')?.addEventListener('click', () => {
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

    document.getElementById('complaintForm')?.addEventListener('submit', (e) => {
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

  // 7. Botón: Escríbenos por WhatsApp
  document.getElementById('btnWhatsapp')?.addEventListener('click', () => {
    const phone = '51971101173';
    const text = encodeURIComponent('Hola Shalom, necesito ayuda con mi envío.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  });

  // 8. Asistente Virtual conectado a Supabase Edge Function + respaldo local entrenado
  const AI_ENDPOINT_URL = 'https://owgmbdvzkpolnyabfkcp.supabase.co/functions/v1/asistente-shalom';
  const SUPABASE_ANON_KEY = 'sb_publishable_x8MsmF6ThrrsCSLIY7VWiQ_VmesN0BY';
  const AI_TIMEOUT_MS = 5000;

  const SYSTEM_KNOWLEDGE = `
Eres el Asistente Virtual oficial de Shalom Cargo (Cotizador Express / Central de Ayuda).
Responsable / Titular: Jesús Alberto Timaná Gaspar.
Contacto / Yape / Plin: 971101173.
Horarios: Lunes a Sábado de 8:00 am a 8:00 pm; recojos urgentes los domingos de 9:00 am a 1:00 pm.

Reglas estrictas:
1) Responde en español, de forma directa, breve, clara y amable.
2) NO uses asteriscos (**), ni símbolos de formato Markdown en el texto.
3) NUNCA digas que borraste, eliminaste, limpiaste o reiniciaste datos, envíos, cotizaciones o bases de datos. Tú solo consultas y orientas; no tienes permiso para borrar ni modificar registros. Si piden borrar datos o la web, indica claramente que no puedes borrar ni modificar datos ni el sistema.
4) Si el usuario pregunta por un código, guía o envío, revisa CONTEXTO ACTUAL DEL USUARIO y muestra los datos encontrados (código, origen, destino, estado, monto o detalles). Si no aparece el código consultado, dilo claramente.
5) Si el usuario pide cálculos o temas fuera de Shalom Cargo, responde de forma breve y vuelve a ofrecer ayuda con cotizaciones, pagos, boletas o rastreo.

Flujo de la app:
- Cotización: cálculo según origen, destino, envoltorio (Sobre, Caja, Bulto), dimensiones, peso y modalidad (En agencia o A domicilio).
- Pago: Yape QR, Plin (al 971101173) o En agencia; exige N° de operación y confirmación de depósito para pagos digitales.
- Comprobante / Boleta PDF: boleta en formato 115 x 215 mm con datos del envío, estado, responsable y agradecimiento.
- Mis Envíos y Rastreo: ver envíos cotizados/pagados, buscar por código de guía y descargar boleta PDF.
- Restricciones: no enviar inflamables, dinero en efectivo, perecibles sin embalaje térmico ni artículos prohibidos.
`;

  function parseJsonSeguro(valor, fallback) {
    if (!valor) return fallback;
    try {
      return JSON.parse(valor);
    } catch {
      return fallback;
    }
  }

  function limpiarTextoRespuesta(texto) {
    return String(texto || '')
      .replace(/\*\*/g, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .trim();
  }

  function obtenerContextoEnviosLocales() {
    const mapa = parseJsonSeguro(localStorage.getItem('shalom_boletas_por_codigo'), {});
    const ultimoComp = parseJsonSeguro(localStorage.getItem('shalom_comprobante_pago'), null);
    const ultimaCot = parseJsonSeguro(localStorage.getItem('shalom_cotizacion_actual'), null);

    const registrosExtra = [];
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (!clave) continue;
      if (['shalom_boletas_por_codigo', 'shalom_comprobante_pago', 'shalom_cotizacion_actual'].includes(clave)) {
        continue;
      }
      if (/(shalom|envio|envío|guia|guía|boleta|cotiza|orden|tracking)/i.test(clave)) {
        const parsed = parseJsonSeguro(localStorage.getItem(clave), null);
        if (parsed) {
          registrosExtra.push({ clave, datos: parsed });
        }
      }
    }

    const lista = Object.values(mapa);

    return {
      totalGuardados: lista.length,
      ultimoComprobante: ultimoComp,
      ultimaCotizacion: ultimaCot,
      envios: lista.slice(0, 15),
      registrosAdicionales: registrosExtra.slice(0, 10)
    };
  }

  function buscarCodigoEnContexto(mensajeUsuario, ctx) {
    const matches = String(mensajeUsuario || '').match(/[A-Za-z]{2,6}[-_ ]?\d{2,10}|\b\d{4,12}\b/g) || [];
    if (matches.length === 0) return null;

    const candidatos = [];
    if (Array.isArray(ctx.envios)) candidatos.push(...ctx.envios);
    if (ctx.ultimoComprobante) candidatos.push(ctx.ultimoComprobante);
    if (ctx.ultimaCotizacion) candidatos.push(ctx.ultimaCotizacion);
    if (Array.isArray(ctx.registrosAdicionales)) {
      ctx.registrosAdicionales.forEach((item) => {
        if (Array.isArray(item.datos)) candidatos.push(...item.datos);
        else if (item.datos && typeof item.datos === 'object') candidatos.push(...Object.values(item.datos));
      });
    }

    for (const token of matches) {
      const limpio = token.replace(/[-_ ]/g, '').toLowerCase();
      for (const reg of candidatos) {
        if (!reg || typeof reg !== 'object') continue;
        const textoReg = JSON.stringify(reg).toLowerCase();
        const codigoReg = String(reg.codigo || reg.guia || reg.numeroGuia || reg.id || '')
          .replace(/[-_ ]/g, '')
          .toLowerCase();
        if ((codigoReg && codigoReg.includes(limpio)) || textoReg.includes(limpio)) {
          return { token, registro: reg };
        }
      }
    }

    return null;
  }

  function formatearHallazgoCodigo(hallazgo) {
    const r = hallazgo.registro || {};
    const cod = r.codigo || r.guia || r.numeroGuia || r.id || hallazgo.token;
    const partes = [`Código ${cod}`];

    if (r.origen && r.destino) {
      partes.push(`ruta ${r.origen} hacia ${r.destino}`);
    }
    if (r.estadoPago || r.estado) {
      partes.push(`estado ${r.estadoPago || r.estado}`);
    }
    if (r.total !== undefined && r.total !== null && r.total !== '') {
      partes.push(`monto S/ ${r.total}`);
    }
    if (r.metodoPago) {
      partes.push(`pago ${r.metodoPago}`);
    }

    return `${partes.join(', ')}. Puedes revisar su detalle o boleta PDF en Rastreo o Mis envíos.`;
  }

  function respuestaLocalEntrenada(mensajeUsuario) {
    const q = String(mensajeUsuario || '').toLowerCase().trim();
    const ctx = obtenerContextoEnviosLocales();
    const ultimo = ctx.ultimoComprobante || ctx.ultimaCotizacion || ctx.envios[0] || null;

    if (/(borra|borrar|elimina|eliminar|reinicia|reiniciar|limpia|limpiar).*(base|datos|web|empresa|sistema|todo)/i.test(q)) {
      return 'No puedo borrar ni modificar datos, envíos, cotizaciones ni la información de la web o base de datos.';
    }

    const hallazgo = buscarCodigoEnContexto(mensajeUsuario, ctx);
    if (hallazgo) {
      return formatearHallazgoCodigo(hallazgo);
    }

    if (/(hola|buenas|buenos dias|buenas tardes|buenas noches|que tal)/.test(q)) {
      return 'Hola, soy el Asistente Virtual de Shalom Cargo. Puedo ayudarte con cotizaciones, pagos con Yape o Plin, boleta PDF, rastreo de códigos o horarios.';
    }

    if (/(gracias|listo|perfecto|entendido|chau|adios)/.test(q)) {
      return 'Gracias por escribir a Shalom Cargo. Si deseas revisar otro código o cotizar un envío, aquí estoy.';
    }

    if (/(pago|yape|plin|deposito|operacion|agencia|pagar)/.test(q)) {
      return 'Aceptamos Yape QR, Plin al 971101173 y pago en agencia. Para Yape o Plin ingresa tu N° de operación (mínimo 5 caracteres) y marca la confirmación de depósito antes de generar tu boleta.';
    }

    if (/(boleta|pdf|comprobante|factura|descargar|115)/.test(q)) {
      const ref = ultimo && ultimo.codigo ? ` de tu orden ${ultimo.codigo}` : '';
      return `La boleta se genera en formato PDF de 115 x 215 mm con ruta, estado de pago y responsable. Puedes descargarla en Comprobante o Rastreo${ref}.`;
    }

    if (/(rastrea|guia|guía|codigo|código|estado|donde esta|dónde está|seguimiento)/.test(q)) {
      if (ultimo && ultimo.codigo) {
        return `Tengo registrado el código ${ultimo.codigo} (${ultimo.origen || 'origen'} hacia ${ultimo.destino || 'destino'}, estado ${ultimo.estadoPago || 'COTIZADO'}). Ábrelo en Rastreo para ver su detalle y boleta PDF.`;
      }
      return 'Indícame el código de tu envío o búscalo en Rastreo o Mis envíos para revisar su estado.';
    }

    if (/(cotiza|cotizar|precio|tarifa|peso|sobre|caja|bulto|domicilio)/.test(q)) {
      return 'En Cotización calculas el envío según origen, destino, envoltorio (Sobre, Caja o Bulto), medidas, peso y entrega en agencia o a domicilio.';
    }

    if (/(horario|hora|atienden|domingo|sabado|sábado|atencion|atención)/.test(q)) {
      return 'Atendemos de lunes a sábado de 8:00 am a 8:00 pm, y los domingos de 9:00 am a 1:00 pm para recojos urgentes en agencias principales.';
    }

    if (/(restringido|prohibido|inflamable|efectivo|perecible|recojo|dni|seguridad)/.test(q)) {
      return 'Para recojo se pide DNI físico original y clave de 4 dígitos. No se envían inflamables, efectivo, perecibles sin embalaje térmico ni artículos prohibidos.';
    }

    if (/(dueno|dueño|titular|responsable|contacto|telefono|teléfono|whatsapp|asesor)/.test(q)) {
      return 'El responsable del servicio es Jesús Alberto Timaná Gaspar y el número de contacto / Yape / Plin es 971101173.';
    }

    return 'Puedo orientarte sobre cotizaciones, pagos con Yape/Plin/Agencia, boleta PDF (115 x 215 mm), consulta de códigos o horarios. También puedes escribir al WhatsApp 971101173.';
  }

  async function obtenerRespuestaAsistente(historial, ultimoMensaje) {
    const contextoLocal = obtenerContextoEnviosLocales();
    const hallazgoLocal = buscarCodigoEnContexto(ultimoMensaje, contextoLocal);

    // Respuesta rápida cuando se consulta un código que ya está guardado localmente
    if (hallazgoLocal && String(ultimoMensaje || '').trim().length <= 28) {
      return limpiarTextoRespuesta(formatearHallazgoCodigo(hallazgoLocal));
    }

    if (AI_ENDPOINT_URL) {
      const controller = new AbortController();
      const timerId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (SUPABASE_ANON_KEY) {
          headers['apikey'] = SUPABASE_ANON_KEY;
          headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
        }

        const res = await fetch(AI_ENDPOINT_URL, {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: SYSTEM_KNOWLEDGE,
            contextoEnvios: contextoLocal,
            messages: historial.slice(-6)
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            return limpiarTextoRespuesta(data.reply);
          }
        }
      } catch (err) {
        // Si tarda o falla la red, cae de inmediato al motor local entrenado
      } finally {
        clearTimeout(timerId);
      }
    }

    return limpiarTextoRespuesta(respuestaLocalEntrenada(ultimoMensaje));
  }

  document.getElementById('btnVirtualAssistant')?.addEventListener('click', () => {
    const historialConversacion = [];

    openModal(
      'Asistente Virtual Shalom',
      `
      <div class="chat-box" id="chatBox" style="display:flex;flex-direction:column;gap:8px;max-height:240px;overflow-y:auto;margin-bottom:10px;">
        <div class="msg-bot">Hola, soy el Asistente Virtual de Shalom. Pregúntame sobre pagos (Yape/Plin), boleta PDF, rastreo de códigos, cotización o horarios.</div>
      </div>
      <div id="quickPrompts" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
        <button type="button" class="quick-chip" data-q="¿Cómo pago con Yape o Plin?" style="font-size:11px;padding:5px 9px;border-radius:999px;border:1px solid #d1d5db;background:#f5f7fb;color:#111827;cursor:pointer;">Métodos de pago</button>
        <button type="button" class="quick-chip" data-q="¿Cómo descargo mi boleta PDF?" style="font-size:11px;padding:5px 9px;border-radius:999px;border:1px solid #d1d5db;background:#f5f7fb;color:#111827;cursor:pointer;">Boleta PDF</button>
        <button type="button" class="quick-chip" data-q="¿Cómo rastreo mi envío?" style="font-size:11px;padding:5px 9px;border-radius:999px;border:1px solid #d1d5db;background:#f5f7fb;color:#111827;cursor:pointer;">Rastrear envío</button>
        <button type="button" class="quick-chip" data-q="¿Cuáles son los horarios?" style="font-size:11px;padding:5px 9px;border-radius:999px;border:1px solid #d1d5db;background:#f5f7fb;color:#111827;cursor:pointer;">Horarios</button>
      </div>
      <form class="modal-form" id="chatForm" style="flex-direction:row;gap:8px;">
        <input type="text" id="chatInput" class="modal-input" placeholder="Escribe tu consulta..." required />
        <button type="submit" class="modal-submit" id="btnEnviarChat" style="background:#d60c23; padding:0 16px;">Enviar</button>
      </form>
      `
    );

    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const btnEnviar = document.getElementById('btnEnviarChat');

    async function enviarMensaje(texto) {
      const userMsg = (texto || '').trim();
      if (!userMsg) return;

      chatBox.innerHTML += `<div class="msg-user">${userMsg}</div>`;
      historialConversacion.push({ role: 'user', content: userMsg });
      chatInput.value = '';
      chatBox.scrollTop = chatBox.scrollHeight;

      btnEnviar.disabled = true;
      const typingId = 'typing-' + Date.now();
      chatBox.innerHTML += `<div class="msg-bot" id="${typingId}">Escribiendo...</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      const respuesta = await obtenerRespuestaAsistente(historialConversacion, userMsg);
      historialConversacion.push({ role: 'assistant', content: respuesta });

      const typingEl = document.getElementById(typingId);
      if (typingEl) {
        typingEl.textContent = respuesta;
      } else {
        chatBox.innerHTML += `<div class="msg-bot">${respuesta}</div>`;
      }
      btnEnviar.disabled = false;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    document.querySelectorAll('.quick-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        enviarMensaje(chip.getAttribute('data-q'));
      });
    });

    document.getElementById('chatForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      enviarMensaje(chatInput.value);
    });
  });
});