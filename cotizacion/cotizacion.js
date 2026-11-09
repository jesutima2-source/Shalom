document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirección del botón de perfil superior hacia detalle.html
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', function() {
      window.location.href = '../detalles/detalle.html';
    });
  }

  // 2. Lógica del Cotizador Express
  const pkgCards = document.querySelectorAll('.pkg-card');
  const deliveryBtns = document.querySelectorAll('.delivery-btn');
  const costDisplay = document.getElementById('cost-display');
  const inpPeso = document.getElementById('inp-peso');
  const inpLargo = document.getElementById('inp-largo');
  const inpAncho = document.getElementById('inp-ancho');
  const inpAlto = document.getElementById('inp-alto');
  const selectOrigen = document.getElementById('select-origen');
  const selectDestino = document.getElementById('select-destino');
  const btnSubmit = document.getElementById('btn-submit');

  let currentPkg = 'sobre';
  let currentDelivery = 'agencia';

  function calculateCost() {
    if (!costDisplay) return;

    const peso = parseFloat(inpPeso.value) || 1;
    const largo = parseFloat(inpLargo.value) || 1;
    const ancho = parseFloat(inpAncho.value) || 1;
    const alto = parseFloat(inpAlto.value) || 1;

    const pesoVolumetrico = (largo * ancho * alto) / 6000;
    const pesoFacturable = Math.max(peso, pesoVolumetrico);

    let baseRate = 10.00;

    if (currentPkg === 'caja') baseRate += 5.00;
    if (currentPkg === 'bulto') baseRate += 12.00;
    if (currentDelivery === 'domicilio') baseRate += 7.00;
    if (selectOrigen && selectDestino && selectOrigen.value !== selectDestino.value) {
      baseRate += 3.00;
    }
    if (pesoFacturable > 1) {
      baseRate += (pesoFacturable - 1) * 3.50;
    }

    costDisplay.textContent = `S/ ${baseRate.toFixed(2)}`;
  }

  pkgCards.forEach(card => {
    card.addEventListener('click', () => {
      pkgCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentPkg = card.getAttribute('data-pkg');
      calculateCost();
    });
  });

  deliveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deliveryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDelivery = btn.getAttribute('data-delivery');
      calculateCost();
    });
  });

  [inpPeso, inpLargo, inpAncho, inpAlto, selectOrigen, selectDestino].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', calculateCost);
      elem.addEventListener('change', calculateCost);
    }
  });

  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      alert(`¡Cotización Registrada con éxito!\nTotal: ${costDisplay.textContent}`);
    });
  }

  calculateCost();
});