let calendar; // 👉 variable global para poder actualizar el calendario

document.addEventListener('DOMContentLoaded', () => {
  cargarReservas();

  const formModal = document.getElementById('formReservaModal');
  if (formModal) {
    formModal.addEventListener('submit', e => {
      e.preventDefault();

      const docente = document.getElementById('docenteModal').value;
      const materia = document.getElementById('materia').value;
      const curso = document.getElementById('curso').value;
      const espacio = document.getElementById('espacio').value;

      // Recursos seleccionados
      const recursosSeleccionados = [];
      document.querySelectorAll('input[name="recursos"]:checked').forEach(chk => {
        if (chk.value === "Notebooks") {
          const cantidad = document.getElementById('cantidadNotebooks').value || 1;
          recursosSeleccionados.push(`${chk.value} (${cantidad})`);
        } else {
          recursosSeleccionados.push(chk.value);
        }
      });

      // Fecha seleccionada
      const fecha = document.getElementById('fecha').value;

      // Horarios seleccionados
      const horariosSeleccionados = [];
      document.querySelectorAll('input[name="horarios"]:checked').forEach(chk => {
        horariosSeleccionados.push(chk.value);
      });

      // Construir objeto de reserva
      const nuevaReserva = {
        docente,
        materia,
        curso,
        espacio,
        recursos: recursosSeleccionados,
        fecha,
        horarios: horariosSeleccionados
      };

      // Enviar al servidor
      fetch('/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      })
        .then(res => res.text())
        .then(msg => {
          alert(msg);
          cerrarModal();

          // 👉 Mostrar horarios junto al docente en el calendario
          if (calendar) {
            calendar.addEvent({
              title: `${docente} - ${materia} (${espacio}) | ${horariosSeleccionados.join(", ")}`,
              start: fecha
            });
          }
        })
        .catch(err => console.error('Error creando reserva:', err));
    });
  }
});

function cargarReservas() {
  fetch('/reservas')
    .then(res => res.json())
    .then(data => {
      const calendarEl = document.getElementById('calendar');
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // 👉 vistas mes, semana, día
        },
        events: data.map(r => ({
          title: `${r.docente} - ${r.materia} (${r.espacio}) | ${r.horarios.join(", ")}`,
          start: r.fecha
        }))
      });
      calendar.render();
    })
    .catch(err => console.error('Error cargando reservas:', err));
}

function cerrarModal() {
  document.getElementById('modalReserva').style.display = 'none';
}

