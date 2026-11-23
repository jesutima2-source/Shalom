document.addEventListener('DOMContentLoaded', function() {
  // 1. Recuperar los datos del usuario desde localStorage
  const storedUser = localStorage.getItem('shalom_user');

  if (!storedUser) {
    // Si no hay sesión activa, redirigir al login principal
    alert('No hay una sesión activa. Por favor ingresa tu DNI.');
    window.location.href = '../index.html'; 
    return;
  }

  const user = JSON.parse(storedUser);

  // 2. Elementos del DOM a actualizar
  const displayDni = document.getElementById('displayDni');
  const displayNombreFull = document.getElementById('displayNombreFull');
  const displayNombreShort = document.getElementById('displayNombreShort');
  const displayEmail = document.getElementById('displayEmail');
  const avatarInitials = document.getElementById('avatarInitials');
  const userBadge = document.getElementById('userBadge'); // <--- Captura el badge superior
  
  // Botones de acción
  const btnBack = document.getElementById('btnBack');
  const btnLogout = document.getElementById('btnLogout');
  const btnCopyDni = document.getElementById('btnCopyDni');
  const btnShowQr = document.getElementById('btnShowQr');
  const btnShipmentDetail = document.getElementById('btnShipmentDetail');

  // 3. Rellenar la interfaz con los datos reales
  if (displayDni) displayDni.textContent = user.dni || '---';
  if (displayNombreFull) displayNombreFull.textContent = user.nombre || '---';
  
  if (displayNombreShort && user.nombre) {
    displayNombreShort.textContent = user.nombre;
  }

  if (displayEmail) displayEmail.textContent = user.email || '---';

  // Actualización dinámica del tipo de cuenta en la insignia superior (Prime / Client)
  if (userBadge) {
    const tipo = user.tipo_cuenta || 'SHALOM PRIME';
    userBadge.innerHTML = `<span class="status-dot"></span> CUENTA ACTIVA • ${tipo.toUpperCase()}`;
  }

  // Generar iniciales dinámicas para el avatar (ej. Jesús Timaná -> JT)
  if (avatarInitials && user.nombre) {
    const partes = user.nombre.trim().split(' ');
    let iniciales = partes[0][0];
    if (partes.length > 1) {
      iniciales += partes[partes.length - 1][0];
    }
    avatarInitials.textContent = iniciales.toUpperCase();
  }

  // 4. Funcionalidad del botón de retroceso (dirige a envio.html)
  if (btnBack) {
    btnBack.addEventListener('click', function() {
      window.location.href = '../envios/envio.html';
    });
  }

  // 5. Funcionalidad de Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      localStorage.removeItem('shalom_user');
      window.location.href = '../index.html';
    });
  }

  // 6. Funcionalidad de Copiar DNI
  if (btnCopyDni) {
    btnCopyDni.addEventListener('click', function() {
      navigator.clipboard.writeText(user.dni).then(() => {
        alert('¡DNI copiado al portapapeles!');
      }).catch(err => {
        console.error('Error al copiar: ', err);
      });
    });
  }

  // 7. Interacciones adicionales (QR y Guía)
  if (btnShowQr) {
    btnShowQr.addEventListener('click', function() {
      alert('Mostrando código QR seguro para recojo en agencia del DNI: ' + user.dni);
    });
  }

  if (btnShipmentDetail) {
    btnShipmentDetail.addEventListener('click', function() {
      alert('Abriendo detalles de la Guía #SH-884920 (Ruta: Huancayo -> Lima)');
    });
  }
});