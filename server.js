const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Autenticación con credenciales desde variable de entorno
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

// Endpoint Biblioteca
app.get('/api/reservas-biblioteca', async (req, res) => {
  try {
    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.events.list({
      calendarId: 'informatica7733@gmail.com', // ✅ Biblioteca
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas de Biblioteca' });
  }
});

// Endpoint STEAM
app.get('/api/reservas-steam', async (req, res) => {
  try {
    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.events.list({
      calendarId: 'tutoria.preceptoria.escuela7733@gmail.com', // ✅ STEAM
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reservas de STEAM' });
  }
});

// Ruta raíz: abre Biblioteca por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
