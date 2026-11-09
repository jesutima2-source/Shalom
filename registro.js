// registro.js
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const dniInput = document.getElementById('dni');
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');

  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const dniVal = dniInput.value.trim();

      if (dniVal.length !== 8) {
        alert('Por favor ingresa un DNI válido de 8 dígitos.');
        return;
      }

      if (typeof supabaseClient === 'undefined') {
        alert('Error: El cliente de Supabase no está inicializado.');
        return;
      }

      try {
        // Consultar directamente en Supabase
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('*')
          .eq('dni', dniVal)
          .maybeSingle();

        console.log("Respuesta de Supabase:", { data, error });

        if (error) {
          alert('Error de Supabase: ' + error.message);
          return;
        }

        if (!data) {
          alert('El DNI ' + dniVal + ' no existe en la tabla usuarios.');
          return;
        }

        // Autocompletar campos visuales si existen
        if (nombreInput) nombreInput.value = data.nombre_completo || '';
        if (emailInput) emailInput.value = data.email || '';

        // Guardar sesión en localStorage con los datos EXACTOS de Supabase
        const userData = {
          dni: data.dni,
          nombre: data.nombre_completo,
          email: data.email,
          tipo_cuenta: data.tipo_cuenta ? data.tipo_cuenta : 'SHALOM PRIME'
        };

        // Limpiar cualquier sesión previa antes de guardar la nueva
        localStorage.removeItem('shalom_user');
        localStorage.setItem('shalom_user', JSON.stringify(userData));

        // Redirigir
        window.location.href = 'envios/envio.html';

      } catch (err) {
        console.error("Excepción de red capturada:", err);
        alert('Error de red al conectar con Supabase.');
      }
    });
  }
});