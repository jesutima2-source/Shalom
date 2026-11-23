document.addEventListener('DOMContentLoaded', () => {
  const raw = localStorage.getItem('shalom_comprobante_pago');
  const data = raw
    ? JSON.parse(raw)
    : {
        codigo: 'SHL-873681',
        origen: 'Huancayo',
        destino: 'Cusco',
        envoltorio: 'Sobre',
        dimensiones: '25x15x5 cm',
        peso: '1.0 kg',
        modalidad: 'En agencia',
        metodoPago: 'Yape QR',
        nroOperacion: '12345',
        estadoPago: 'PAGADO',
        total: 'S/ 13.00',
        fechaPago: new Date().toLocaleString('es-PE')
      };

  document.getElementById('compCodigo').textContent = `${data.codigo} · ${data.estadoPago}`;
  document.getElementById('compRuta').textContent = `${data.origen} → ${data.destino}`;
  document.getElementById('compPaquete').textContent = `${data.envoltorio} · ${data.peso}`;
  document.getElementById('compDimensiones').textContent = data.dimensiones;
  document.getElementById('compModalidad').textContent = data.modalidad;
  document.getElementById('compMetodo').textContent = data.metodoPago;
  document.getElementById('compOperacion').textContent = data.nroOperacion;
  document.getElementById('compTotal').textContent = data.total;

  function generarPdf() {
    const { jsPDF } = window.jspdf;
    // Tamaño intermedio tipo boleta comercial (115mm ancho x 215mm alto)
    const ticketWidth = 115;
    const ticketHeight = 215;
    const doc = new jsPDF({ unit: 'mm', format: [ticketWidth, ticketHeight] });

    const margin = 7;
    const contentWidth = ticketWidth - margin * 2;
    const rightX = ticketWidth - margin;

    // 1. Cabecera superior de marca
    doc.setFillColor(19, 22, 34); // #131622
    doc.rect(0, 0, ticketWidth, 34, 'F');

    doc.setFillColor(214, 12, 35); // #d60c23
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

    const esPagado = String(data.estadoPago).toUpperCase().includes('PAGADO');
    doc.setFillColor(esPagado ? 22 : 217, esPagado ? 163 : 119, esPagado ? 74 : 6);
    doc.roundedRect(margin + 4, y + 14.8, 30, 4.6, 1.2, 1.2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(String(data.estadoPago || 'PAGADO'), margin + 19, y + 18, {
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
    doc.setFontSize(11.5);
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

  document.getElementById('btnDescargarPdf').addEventListener('click', () => {
    const doc = generarPdf();
    doc.save(`Boleta-${data.codigo}.pdf`);
  });

  document.getElementById('btnCompartirPdf').addEventListener('click', async () => {
    const doc = generarPdf();
    const blob = doc.output('blob');
    const file = new File([blob], `Boleta-${data.codigo}.pdf`, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `Boleta Shalom ${data.codigo}`,
        text: `Gracias por elegir nuestra empresa. Boleta ${data.codigo}: ${data.origen} -> ${data.destino} · Total: ${data.total}`,
        files: [file]
      });
    } else {
      const msg = encodeURIComponent(
        `¡Gracias por elegir nuestra empresa!\nBoleta Shalom (${data.codigo}) - ${data.estadoPago}\nTitular: Jesús Alberto Timaná Gaspar\nRuta: ${data.origen} -> ${data.destino}\nMétodo: ${data.metodoPago}\nN° Operación: ${data.nroOperacion}\nTotal: ${data.total}`
      );
      window.open(`https://wa.me/51971101173?text=${msg}`, '_blank');
    }
  });
});