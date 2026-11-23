document.addEventListener('DOMContentLoaded', function() {
  const shipmentList = document.querySelector('.shipment-list');
  const chipCounter = document.querySelector('.summary-header .chip');

  // 1. Cargar envíos cotizados o pagados desde localStorage
  const boletasMap = JSON.parse(localStorage.getItem('shalom_boletas_por_codigo') || '{}');
  const ultimoComprobante = JSON.parse(localStorage.getItem('shalom_comprobante_pago') || 'null');
  const ultimaCotizacion = JSON.parse(localStorage.getItem('shalom_cotizacion_actual') || 'null');

  const mapaCombinado = { ...boletasMap };
  if (ultimaCotizacion && ultimaCotizacion.codigo && !mapaCombinado[ultimaCotizacion.codigo]) {
    mapaCombinado[ultimaCotizacion.codigo] = {
      ...ultimaCotizacion,
      estadoPago: 'COTIZADO',
      fechaCorta: new Date().toLocaleDateString('es-PE')
    };
  }
  if (ultimoComprobante && ultimoComprobante.codigo) {
    mapaCombinado[ultimoComprobante.codigo] = {
      ...mapaCombinado[ultimoComprobante.codigo],
      ...ultimoComprobante,
      fechaCorta: mapaCombinado[ultimoComprobante.codigo]?.fechaCorta || new Date().toLocaleDateString('es-PE')
    };
  }

  const enviosGuardados = Object.values(mapaCombinado);

  if (shipmentList && enviosGuardados.length > 0) {
    enviosGuardados.forEach((env) => {
      const esPagado = String(env.estadoPago || '').toUpperCase().includes('PAGADO');
      const categoria = esPagado ? 'transito' : 'recoger';
      const estadoTexto = esPagado ? 'En tránsito' : 'Cotizado';
      const fechaTexto = env.fechaCorta || new Date().toLocaleDateString('es-PE');

      const card = document.createElement('div');
      card.className = 'shipment-card';
      card.setAttribute('data-category', categoria);
      card.setAttribute('data-guia', env.codigo);
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <div class="${esPagado ? 'blue-bar' : 'orange-bar'}"></div>
        <div class="shipment-icon-box ${esPagado ? 'blue-bg' : 'orange-bg'}">
          <i class="fa-solid ${esPagado ? 'fa-truck-fast' : 'fa-file-invoice-dollar'}"></i>
        </div>
        <div class="shipment-details">
          <strong>Guía #${env.codigo}</strong>
          <p>${env.origen} &rarr; ${env.destino} (${env.total || 'S/ 13.00'})</p>
          <small><i class="fa-regular fa-calendar"></i> ${fechaTexto} · ${env.estadoPago || 'COTIZADO'}</small>
        </div>
        <span class="status-pill ${esPagado ? 'blue-pill' : 'orange-pill'}">${estadoTexto}</span>
        <i class="fa-solid fa-chevron-right nav-arrow"></i>
      `;

      shipmentList.prepend(card);
    });
  }

  // 2. Funcionalidad de los botones de filtro (incluye tarjetas dinámicas)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const shipmentCards = document.querySelectorAll('.shipment-card');

  if (chipCounter) {
    chipCounter.textContent = `${shipmentCards.length} activos`;
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      shipmentCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'todos') {
          card.style.display = 'flex';
        } else if (filter === 'transito' && category === 'transito') {
          card.style.display = 'flex';
        } else if (filter === 'recoger' && (category === 'recoger' || category === 'cotizado')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Botón de perfil superior para regresar a la pantalla de detalles
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', function() {
      window.location.href = '../detalles/detalle.html';
    });
  }

  // 4. Funcionalidad para rastrear una nueva guía
  const btnRastrearNueva = document.getElementById('btnRastrearNueva');
  if (btnRastrearNueva) {
    btnRastrearNueva.addEventListener('click', function() {
      const nuevaGuia = prompt('Ingresa el número de tu guía Shalom (ej. SHL-...):');
      if (nuevaGuia && nuevaGuia.trim() !== '') {
        const codigoLimpio = nuevaGuia.trim().replace(/^#/, '');
        window.location.href = `../rastreo/rastreo.html?guia=${encodeURIComponent(codigoLimpio)}`;
      }
    });
  }

  // 5. Interacción al hacer clic en cualquier guía del listado
  shipmentCards.forEach(card => {
    card.addEventListener('click', function() {
      const codigoAttr = this.getAttribute('data-guia');
      const guiaTexto = this.querySelector('strong')?.innerText || '';
      const codigoLimpio = codigoAttr || guiaTexto.replace(/Guía\s*#?/i, '').trim();

      if (codigoLimpio) {
        window.location.href = `../rastreo/rastreo.html?guia=${encodeURIComponent(codigoLimpio)}`;
      }
    });
  });
});