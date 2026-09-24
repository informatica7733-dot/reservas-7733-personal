const { google } = require('googleapis');

// Alcances: solo lectura de eventos
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Leer credenciales desde archivo local o variable de entorno
const credentials = process.env.GOOGLE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT) // Render: variable de entorno
  : require('./service-account.json');             // Local: archivo físico

// Crear cliente de autenticación
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

// Inicializar API de Calendar
const calendar = google.calendar({ version: 'v3', auth });

// Función para obtener eventos
async function getEvents(calendarId) {
  const res = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    timeMax: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return res.data.items.map(event => ({
    fecha: event.start.dateTime || event.start.date,
    hora: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('es-AR') : '',
    usuario: event.summary,
  }));
}

module.exports = { getEvents };
