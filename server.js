const { google } = require('googleapis');
const express = require('express');
const app = express();

// Autenticación con service account
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

// Biblioteca
app.get('/api/reservas-biblioteca', async (req, res) => {
  try {
    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.events.list({
      calendarId: 'tutoria.preceptoria.escuela7733@gmail.com',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener reservas de Biblioteca');
  }
});

// STEAM
app.get('/api/reservas-steam', async (req, res) => {
  try {
    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.events.list({
      calendarId: 'steam.preceptoria.escuela7733@gmail.com',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener reservas de STEAM');
  }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
