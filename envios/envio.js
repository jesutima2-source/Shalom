document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Funcionalidad de los botones de filtro
  const tabButtons = document.querySelectorAll('.tab-btn');
  const shipmentCards = document.querySelectorAll('.shipment-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Cambiar la clase activa del botón de filtro
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      // Mostrar u ocultar tarjetas según la categoría seleccionada
      shipmentCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'todos') {
          card.style.display = 'flex';
        } else if (filter === 'transito' && category === 'transito') {
          card.style.display = 'flex';
        } else if (filter === 'recoger' && category === 'recoger') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. Botón de perfil superior para regresar a la pantalla de detalles
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', function() {
      window.location.href = '../detalles/detalle.html';
    });
  }

  // 3. Funcionalidad para registrar y rastrear una nueva guía
  const btnRastrearNueva = document.getElementById('btnRastrearNueva');
  if (btnRastrearNueva) {
    btnRastrearNueva.addEventListener('click', function() {
      const nuevaGuia = prompt('Ingresa el número de tu nueva guía Shalom:');
      if (nuevaGuia && nuevaGuia.trim() !== '') {
        alert(`¡Guía #${nuevaGuia.trim()} agregada correctamente para seguimiento en tiempo real!`);
      }
    });
  }

  // 4. Interacción al hacer clic en cualquier guía del listado
  shipmentCards.forEach(card => {
    card.addEventListener('click', function() {
      const guiaTexto = this.querySelector('strong').innerText;
      alert(`Abriendo detalles de seguimiento para la ${guiaTexto}...`);
    });
  });

});