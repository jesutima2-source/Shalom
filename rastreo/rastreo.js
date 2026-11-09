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

  // 3. Simulación de búsqueda por número de guía
  const btnBuscar = document.getElementById('btnBuscar');
  const inputGuia = document.getElementById('inputGuia');

  if (btnBuscar && inputGuia) {
    btnBuscar.addEventListener('click', () => {
      const codigo = inputGuia.value.trim();
      if (codigo !== '') {
        alert(`Buscando información actualizada para la guía #${codigo}...`);
      } else {
        alert('Por favor ingresa un número de guía válido.');
      }
    });
  }

  // 4. Botón de copiar guía
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('893456789');
      alert('¡Número de guía copiado al portapapeles!');
    });
  }

  // 5. Botones inferiores de acción
  const btnCargo = document.querySelector('.action-btn-light');
  if (btnCargo) {
    btnCargo.addEventListener('click', () => {
      alert('Descargando comprobante de cargo en PDF...');
    });
  }

  const btnCompartir = document.querySelector('.action-btn-dark');
  if (btnCompartir) {
    btnCompartir.addEventListener('click', () => {
      alert('Enlace de rastreo copiado para compartir.');
    });
  }
});