document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnReserva');
  const mensaje = document.getElementById('mensaje');

  btn.addEventListener('click', () => {
    // Llamada al servidor (ruta /reservar)
    fetch('/reservar', { method: 'POST' })
      .then(res => res.text()) // el servidor devuelve texto
      .then(data => {
        // Mostrar la respuesta en pantalla
        mensaje.textContent = data;
      })
      .catch(err => {
        console.error('Error en la reserva:', err);
        mensaje.textContent = "❌ Error al realizar la reserva";
      });
  });
});

