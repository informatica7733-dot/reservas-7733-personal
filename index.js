const express = require('express');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// -------------------- GOOGLE CALENDAR --------------------
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

async function getEvents(calendarId) {
  try {
    const res = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      timeMax: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items.map(event => ({
      fecha: event.start.dateTime || event.start.date,
      hora: event.start.dateTime
        ? new Date(event.start.dateTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        : '',
      usuario: event.summary || 'Reserva sin nombre',
    }));
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    return [];
  }
}

app.get('/api/biblioteca', async (req, res) => {
  const events = await getEvents('TU_CALENDAR_ID_BIBLIOTECA');
  res.json(events);
});

app.get('/api/steam', async (req, res) => {
  const events = await getEvents('TU_CALENDAR_ID_STEAM');
  res.json(events);
});

// -------------------- RECURSOS --------------------
const reservasFile = path.join(__dirname, 'reservas_recursos.json');

function leerReservas() {
  if (!fs.existsSync(reservasFile)) return [];
  return JSON.parse(fs.readFileSync(reservasFile));
}

function guardarReservas(reservas) {
  fs.writeFileSync(reservasFile, JSON.stringify(reservas, null, 2));
}

app.get('/api/recursos', (req, res) => {
  let reservas = leerReservas();
  reservas.sort((a, b) => {
    if (a.fecha < b.fecha) return -1;
    if (a.fecha > b.fecha) return 1;
    const horaA = a.horas.split(',')[0];
    const horaB = b.horas.split(',')[0];
    return horaA.localeCompare(horaB);
  });
  res.json(reservas);
});

app.post('/api/recursos', (req, res) => {
  const nuevaReserva = req.body;
  const reservas = leerReservas();

  // Validación: máximo 20 notebooks por bloque horario en un mismo día
  if (nuevaReserva.notebooks && nuevaReserva.notebooks > 0) {
    const bloques = nuevaReserva.horas.split(',').map(h => h.trim());
    for (const bloque of bloques) {
      // Sumar notebooks ya reservadas en ese día y bloque
      const totalEnBloque = reservas
        .filter(r => r.fecha === nuevaReserva.fecha && r.horas.includes(bloque))
        .reduce((sum, r) => sum + (parseInt(r.notebooks) || 0), 0);

      const disponibles = 20 - totalEnBloque;
      if (nuevaReserva.notebooks > disponibles) {
        return res.status(400).json({
          error: `No hay suficientes notebooks disponibles en el bloque ${bloque}. Solo quedan ${disponibles}.`,
        });
      }
    }
  }

  reservas.push(nuevaReserva);
  guardarReservas(reservas);
  res.json({ mensaje: 'Reserva guardada correctamente', reserva: nuevaReserva });
});

// -------------------- SERVIDOR --------------------
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
