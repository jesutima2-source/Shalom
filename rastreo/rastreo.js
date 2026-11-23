document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirección del botón de perfil superior hacia detalle.html
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', function() {
      window.location.href = '../detalles/detalle.html';
    });
  }

  // 2. Interactividad para las pestañas de búsqueda (DNI / N° de guía)
  const searchTabs = document.querySelectorAll('.search-tab');
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const btnBuscar = document.getElementById('btnBuscar');
  const inputGuia = document.getElementById('inputGuia');
  const guideTag = document.querySelector('.guide-tag');
  const fichaGuia = document.getElementById('fichaGuia');
  const fichaDestino = document.getElementById('fichaDestino');
  const fichaRemitente = document.getElementById('fichaRemitente');
  const linkComprobante = document.getElementById('linkComprobante');

  let envioActual = {
    codigo: '893456789',
    origen: 'Lima Central',
    destino: 'Av. Huaylas 123, Chorrillos, Lima',
    envoltorio: 'Paquete',
    dimensiones: '30x20x15 cm',
    peso: '4.2 kg',
    modalidad: 'A domicilio',
    metodoPago: 'Registrado',
    nroOperacion: 'N/A',
    estadoPago: 'REGISTRADO',
    total: 'S/ 13.00',
    fechaPago: new Date().toLocaleString('es-PE')
  };

  function obtenerRegistroGuardado(codigo) {
    const limpio = String(codigo || '').replace(/^#/, '').trim();
    if (!limpio) return null;

    const mapa = JSON.parse(localStorage.getItem('shalom_boletas_por_codigo') || '{}');
    if (mapa[limpio]) return mapa[limpio];

    const comp = JSON.parse(localStorage.getItem('shalom_comprobante_pago') || 'null');
    if (comp && String(comp.codigo).toLowerCase() === limpio.toLowerCase()) return comp;

    const cot = JSON.parse(localStorage.getItem('shalom_cotizacion_actual') || 'null');
    if (cot && String(cot.codigo).toLowerCase() === limpio.toLowerCase()) {
      return {
        ...cot,
        estadoPago: 'COTIZADO',
        metodoPago: 'Pendiente',
        nroOperacion: 'POR CONFIRMAR',
        fechaPago: cot.fecha || new Date().toLocaleString('es-PE')
      };
    }

    // Si se busca una guía distinta a la de ejemplo y no está en el mapa, tomar la última cotización/comprobante si existe
    const valores = Object.values(mapa);
    if (valores.length > 0 && limpio.toUpperCase().startsWith('SHL-')) {
      const coincidencia = valores.find(
        (v) => String(v.codigo).toLowerCase() === limpio.toLowerCase()
      );
      if (coincidencia) return coincidencia;
    }

    return null;
  }

  function cargarGuiaEnVista(codigo) {
    const limpio = String(codigo || '').replace(/^#/, '').trim();
    if (!limpio) return;

    const guardado = obtenerRegistroGuardado(limpio);

    if (guardado) {
      envioActual = guardado;
      if (guideTag) guideTag.textContent = `Guía #${guardado.codigo}`;
      if (fichaGuia) fichaGuia.textContent = guardado.codigo;
      if (fichaDestino) fichaDestino.textContent = guardado.destino;
      if (fichaRemitente) {
        fichaRemitente.textContent = `Jesús Alberto Timaná Gaspar (${guardado.origen} → ${guardado.destino})`;
      }
      localStorage.setItem('shalom_comprobante_pago', JSON.stringify(guardado));
    } else {
      envioActual = {
        ...envioActual,
        codigo: limpio
      };
      if (guideTag) guideTag.textContent = `Guía #${limpio}`;
      if (fichaGuia) fichaGuia.textContent = limpio;
    }
  }

  // Leer parámetro ?guia=... o cargar la última cotización/comprobante si existe
  const params = new URLSearchParams(window.location.search);
  const guiaParam = params.get('guia');
  const ultimoComp = JSON.parse(localStorage.getItem('shalom_comprobante_pago') || 'null');
  const ultimaCot = JSON.parse(localStorage.getItem('shalom_cotizacion_actual') || 'null');
  const codigoInicial = guiaParam || ultimoComp?.codigo || ultimaCot?.codigo || inputGuia?.value;

  if (codigoInicial) {
    if (inputGuia) inputGuia.value = codigoInicial;
    cargarGuiaEnVista(codigoInicial);
  }

  // 3. Búsqueda por número de guía
  if (btnBuscar && inputGuia) {
    const ejecutarBusqueda = () => {
      const codigo = inputGuia.value.trim().replace(/^#/, '');
      if (codigo !== '') {
        cargarGuiaEnVista(codigo);
      } else {
        alert('Por favor ingresa un número de guía válido.');
      }
    };

    btnBuscar.addEventListener('click', ejecutarBusqueda);
    inputGuia.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') ejecutarBusqueda();
    });
  }

  // Ir a comprobante si se hace clic en "Comprobante"
  if (linkComprobante) {
    linkComprobante.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('shalom_comprobante_pago', JSON.stringify(envioActual));
      window.location.href = '../cotizacion/comprobante/comprobante.html';
    });
  }

  // 4. Botón de copiar guía
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textoCopiar = fichaGuia?.textContent || envioActual.codigo || '893456789';
      navigator.clipboard.writeText(textoCopiar);
      alert(`¡Número de guía ${textoCopiar} copiado al portapapeles!`);
    });
  }

  // 5. Generación de Boleta PDF (115 x 215 mm) idéntica al comprobante
  function generarBoletaPdf(data) {
    const { jsPDF } = window.jspdf;
    const ticketWidth = 115;
    const ticketHeight = 215;
    const doc = new jsPDF({ unit: 'mm', format: [ticketWidth, ticketHeight] });

    const margin = 7;
    const contentWidth = ticketWidth - margin * 2;
    const rightX = ticketWidth - margin;

    // 1. Cabecera superior de marca
    doc.setFillColor(19, 22, 34);
    doc.rect(0, 0, ticketWidth, 34, 'F');

    doc.setFillColor(214, 12, 35);
    doc.rect(0, 34, ticketWidth, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('SHALOM', margin, 13);

    doc.setTextColor(214, 12, 35);
    doc.circle(margin + 31, 11.4, 1.5, 'F');

    doc.setTextColor(210, 215, 230);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('RED NACIONAL DE TRANSPORTE Y LOGÍSTICA', margin, 20);
    doc.text('Titular: Jesús Alberto Timaná Gaspar', margin, 25.5);
    doc.text('Yape / Plin / Soporte: 971101173', margin, 30.8);

    // 2. Caja de Boleta / N° / Estado
    let y = 40;
    doc.setFillColor(245, 247, 251);
    doc.setDrawColor(214, 12, 35);
    doc.setLineWidth(0.55);
    doc.roundedRect(margin, y, contentWidth, 21, 2.5, 2.5, 'FD');

    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('BOLETA DE SERVICIO', margin + 4, y + 6.8);
    doc.text(`N° ${data.codigo}`, rightX - 4, y + 6.8, { align: 'right' });

    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.text(`Fecha: ${data.fechaPago || '-'}`, margin + 4, y + 12.8);

    const esPagado = String(data.estadoPago || '').toUpperCase().includes('PAGADO');
    doc.setFillColor(esPagado ? 22 : 13, esPagado ? 163 : 91, esPagado ? 74 : 198);
    doc.roundedRect(margin + 4, y + 14.8, 30, 4.6, 1.2, 1.2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(String(data.estadoPago || 'REGISTRADO'), margin + 19, y + 18, {
      align: 'center'
    });

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(8);
    doc.text(`Op: ${data.nroOperacion || '-'}`, rightX - 4, y + 18, { align: 'right' });

    // 3. Ruta y modalidad
    y = 65;
    doc.setFillColor(250, 251, 253);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 21, 2.5, 2.5, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text('RUTA DE ENVÍO', margin + 4, y + 6);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`${data.origen}  --->  ${data.destino}`, margin + 4, y + 12.5);

    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Modalidad: ${data.modalidad}  ·  Pago: ${data.metodoPago}`, margin + 4, y + 18.2);

    // 4. Detalle tipo boleta
    y = 90;
    doc.setFillColor(19, 22, 34);
    doc.rect(margin, y, contentWidth, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('CANT.', margin + 3, y + 5.3);
    doc.text('CONCEPTO', margin + 16, y + 5.3);
    doc.text('IMPORTE', rightX - 3, y + 5.3, { align: 'right' });

    y += 8;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, contentWidth, 29, 'FD');

    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.text('1', margin + 5.5, y + 8);
    doc.text(`Envío (${data.envoltorio})`, margin + 16, y + 8);
    doc.text(String(data.total || 'S/ 13.00'), rightX - 3, y + 8, { align: 'right' });

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Tramo: ${data.origen} a ${data.destino}`, margin + 16, y + 14.5);
    doc.text(`Peso: ${data.peso} · Medidas: ${data.dimensiones}`, margin + 16, y + 20.5);
    doc.text(`Entrega: ${data.modalidad}`, margin + 16, y + 26.5);

    // 5. Total de la boleta
    y += 33.5;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(13, 91, 198);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 14.5, 2.5, 2.5, 'FD');

    doc.setTextColor(13, 91, 198);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.text('TOTAL A PAGAR', margin + 4, y + 9.2);

    doc.setFontSize(11.5);
    doc.text(String(data.total || 'S/ 13.00'), rightX - 4, y + 9.4, { align: 'right' });

    // 6. Agradecimiento y responsable
    y += 19;
    doc.setFillColor(245, 247, 251);
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'FD');

    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('¡Gracias por elegir nuestra empresa!', ticketWidth / 2, y + 8, {
      align: 'center'
    });

    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Jesús Alberto Timaná Gaspar', ticketWidth / 2, y + 14, { align: 'center' });
    doc.text('Atención al cliente · 971101173', ticketWidth / 2, y + 19, { align: 'center' });

    // 7. Pie final
    doc.setTextColor(120, 125, 135);
    doc.setFontSize(7.2);
    doc.text('Comprobante digital · Shalom Cargo', ticketWidth / 2, ticketHeight - 6, {
      align: 'center'
    });

    return doc;
  }

  // Botón Descargar Cargo -> descarga la boleta PDF
  const btnCargo = document.querySelector('.action-btn-light');
  if (btnCargo) {
    btnCargo.addEventListener('click', () => {
      const actualCodigo = (inputGuia?.value || envioActual.codigo || '893456789')
        .replace(/^#/, '')
        .trim();
      const registro = obtenerRegistroGuardado(actualCodigo) || {
        ...envioActual,
        codigo: actualCodigo
      };
      const doc = generarBoletaPdf(registro);
      doc.save(`Boleta-${registro.codigo}.pdf`);
    });
  }

  // Botón Compartir
  const btnCompartir = document.querySelector('.action-btn-dark');
  if (btnCompartir) {
    btnCompartir.addEventListener('click', async () => {
      const actualCodigo = (inputGuia?.value || envioActual.codigo || '893456789')
        .replace(/^#/, '')
        .trim();
      const registro = obtenerRegistroGuardado(actualCodigo) || {
        ...envioActual,
        codigo: actualCodigo
      };
      const doc = generarBoletaPdf(registro);
      const blob = doc.output('blob');
      const file = new File([blob], `Boleta-${registro.codigo}.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Boleta Shalom ${registro.codigo}`,
          text: `Guía ${registro.codigo}: ${registro.origen} -> ${registro.destino} · ${registro.total}`,
          files: [file]
        });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        alert(`Enlace de rastreo listo para la guía #${registro.codigo}.`);
      }
    });
  }
});