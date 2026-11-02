document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita que la página se recargue por defecto
      
      // Capturamos los valores de los inputs
      const userData = {
        dni: document.getElementById('dni').value,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value
      };

      // Guardamos en el localStorage
      localStorage.setItem('shalom_user', JSON.stringify(userData));
      
      // Redirigimos a la segunda pantalla
      window.location.href = 'envios/envio.html';
    });
  }
});