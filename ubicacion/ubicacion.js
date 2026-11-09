document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirección del botón de perfil superior hacia detalle.html
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', function() {
      window.location.href = '../detalles/detalle.html';
    });
  }

  // 2. Filtros interactivos (Pills)
  const pillBtns = document.querySelectorAll('.pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 3. Botón de "Cómo llegar"
  const btnComoLlegar = document.querySelector('.btn-como-llegar');
  if (btnComoLlegar) {
    btnComoLlegar.addEventListener('click', () => {
      alert('Abriendo ruta GPS hacia la Agencia Principal (Av. Paseo de la República 1420)...');
    });
  }

  // 4. Limpiar buscador
  const btnClear = document.getElementById('btnClear');
  const inputUbicacion = document.getElementById('inputUbicacion');
  if (btnClear && inputUbicacion) {
    btnClear.addEventListener('click', () => {
      inputUbicacion.value = '';
      inputUbicacion.focus();
    });
  }

  // 5. Clic en agencias de la lista
  const agencyItems = document.querySelectorAll('.agency-item');
  agencyItems.forEach(item => {
    item.addEventListener('click', () => {
      const nombreAgencia = item.querySelector('strong').textContent;
      alert(`Seleccionaste: ${nombreAgencia}. Actualizando vista del mapa...`);
    });
  });
});