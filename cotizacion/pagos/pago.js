document.addEventListener('DOMContentLoaded', () => {
  const rawData = localStorage.getItem('shalom_cotizacion_actual');
  const cotizacion = rawData
    ? JSON.parse(rawData)
    : {
        codigo: 'SHL-202601',
        origen: 'Huancayo',
        destino: 'Cusco',
        envoltorio: 'Sobre',
        dimensiones: '25x15x5 cm',
        peso: '1.0 kg',
        modalidad: 'En agencia',
        total: 'S/ 13.00',
        fecha: new Date().toLocaleString('es-PE')
      };

  document.getElementById('resumenRuta').textContent = `${cotizacion.origen} → ${cotizacion.destino}`;
  document.getElementById('resumenDetalle').textContent = `${cotizacion.envoltorio} · ${cotizacion.peso} · ${cotizacion.modalidad}`;
  document.getElementById('resumenTotal').textContent = cotizacion.total;

  let metodoSeleccionado = 'Yape QR';
  const panelYape = document.getElementById('panelYape');
  const panelAlterno = document.getElementById('panelAlterno');
  const textoAlterno = document.getElementById('textoAlterno');
  const bloqueOperacionAlterno = document.getElementById('bloqueOperacionAlterno');
  const msgError = document.getElementById('msgErrorPago');
  const btnConfirmar = document.getElementById('btnConfirmarPago');

  function mostrarError(texto) {
    if (!msgError) {
      alert(texto);
      return;
    }
    msgError.textContent = texto;
    msgError.classList.remove('hidden');
  }

  function ocultarError() {
    if (msgError) msgError.classList.add('hidden');
  }

  document.querySelectorAll('.method-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      ocultarError();
      document.querySelectorAll('.method-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      metodoSeleccionado = btn.getAttribute('data-method');

      if (metodoSeleccionado === 'Yape QR') {
        panelYape.classList.remove('hidden');
        panelAlterno.classList.add('hidden');
      } else if (metodoSeleccionado === 'Plin') {
        panelYape.classList.add('hidden');
        panelAlterno.classList.remove('hidden');
        bloqueOperacionAlterno.classList.remove('hidden');
        textoAlterno.innerHTML =
          'Transfiere con <strong>Plin</strong> al número <strong>971101173</strong> e ingresa tu operación.';
      } else {
        panelYape.classList.add('hidden');
        panelAlterno.classList.remove('hidden');
        bloqueOperacionAlterno.classList.add('hidden');
        textoAlterno.innerHTML =
          'Se registrará tu orden para pago directo en <strong>ventanilla de agencia</strong>.';
      }
    });
  });

  document.getElementById('btnBack').addEventListener('click', () => {
    window.location.href = '../cotizacion.html';
  });

  btnConfirmar.addEventListener('click', () => {
    ocultarError();

    let nroOperacion = '';

    if (metodoSeleccionado === 'Yape QR') {
      nroOperacion = document.getElementById('inpOperacion')?.value.trim() || '';
      const chkDeposito = document.getElementById('chkDeposito');

      if (nroOperacion.length < 5) {
        mostrarError('Ingresa un número de operación válido (mínimo 5 caracteres) de tu Yape.');
        return;
      }
      if (chkDeposito && !chkDeposito.checked) {
        mostrarError('Marca la casilla confirmando que ya realizaste el depósito al 971101173.');
        return;
      }
    } else if (metodoSeleccionado === 'Plin') {
      nroOperacion = document.getElementById('inpOperacionAlterno')?.value.trim() || '';
      const chkDepositoAlterno = document.getElementById('chkDepositoAlterno');

      if (nroOperacion.length < 5) {
        mostrarError('Ingresa un número de operación válido (mínimo 5 caracteres) de tu Plin.');
        return;
      }
      if (chkDepositoAlterno && !chkDepositoAlterno.checked) {
        mostrarError('Marca la casilla confirmando que ya realizaste la transferencia.');
        return;
      }
    } else {
      nroOperacion = 'AG-' + Math.floor(100000 + Math.random() * 900000);
    }

    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Verificando depósito...</span>';

    setTimeout(() => {
      const comprobanteData = {
        ...cotizacion,
        metodoPago: metodoSeleccionado,
        nroOperacion,
        estadoPago: metodoSeleccionado === 'Agencia' ? 'POR PAGAR EN AGENCIA' : 'PAGADO',
        fechaPago: new Date().toLocaleString('es-PE')
      };

      localStorage.setItem('shalom_comprobante_pago', JSON.stringify(comprobanteData));
      window.location.href = '../comprobante/comprobante.html';
    }, 1200);
  });
});