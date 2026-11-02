document.addEventListener('DOMContentLoaded', function() {
  // 1. Obtener datos del localStorage o usar valores por defecto para pruebas directas
  let savedData = localStorage.getItem('shalom_user');
  let user;

  if (savedData) {
    user = JSON.parse(savedData);
  } else {
    user = {
      dni: '72132589',
      nombre: 'JESUS ALBERTO TIMANA GASPAR',
      email: 'jesutima2@gmail.com'
    };
  }

  // 2. Inyectar datos en pantalla
  const dniElem = document.getElementById('displayDni');
  const nombreFullElem = document.getElementById('displayNombreFull');
  const emailElem = document.getElementById('displayEmail');
  
  if (dniElem) dniElem.innerText = user.dni;
  if (nombreFullElem) nombreFullElem.innerText = user.nombre.toUpperCase();
  if (emailElem) emailElem.innerText = user.email.toUpperCase();

  // 3. Generar iniciales del Avatar
  const parts = user.nombre.trim().split(' ');
  const avatarElem = document.getElementById('avatarInitials');
  const nombreShortElem = document.getElementById('displayNombreShort');

  if (parts.length >= 2) {
    if (avatarElem) avatarElem.innerText = (parts[0][0] + parts[1][0]).toUpperCase();
    if (nombreShortElem) nombreShortElem.innerText = `${parts[0]} ${parts[1]}`;
  } else {
    if (avatarElem) avatarElem.innerText = user.nombre.substring(0, 2).toUpperCase();
    if (nombreShortElem) nombreShortElem.innerText = user.nombre;
  }

  // 4. Funcionalidad interactiva de los botones
  const btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function() {
      window.location.href = '../envios/envio.html';
    });
  }

  const btnCopyDni = document.getElementById('btnCopyDni');
  if (btnCopyDni) {
    btnCopyDni.addEventListener('click', function() {
      const dniText = document.getElementById('displayDni').innerText;
      navigator.clipboard.writeText(dniText).then(() => {
        alert(`¡DNI (${dniText}) copiado al portapapeles!`);
      });
    });
  }

  const btnShowQr = document.getElementById('btnShowQr');
  if (btnShowQr) {
    btnShowQr.addEventListener('click', function() {
      alert(`CÓDIGO QR DE RECOJO\n\nTitular: ${user.nombre}\nDNI: ${user.dni}\n\nMuestra este código en la agencia.`);
    });
  }

  const btnShipmentDetail = document.getElementById('btnShipmentDetail');
  if (btnShipmentDetail) {
    btnShipmentDetail.addEventListener('click', function() {
      alert('DETALLE DEL ENVÍO\n\nGuía: #SH-884920\nRuta: Lima ➔ Arequipa\nEstado: En tránsito (Llegada hoy 18:30 hrs)');
    });
  }

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      if (confirm('¿Deseas cerrar sesión?')) {
        localStorage.removeItem('shalom_user');
        window.location.href = '../index.html';
      }
    });
  }
});