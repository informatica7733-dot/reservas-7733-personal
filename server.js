const express = require('express');
const { getEvents } = require('./calendar');
const app = express();

app.use(express.static('public'));

app.get('/api/biblioteca', async (req, res) => {
  const events = await getEvents('TU_CALENDAR_ID_BIBLIOTECA');
  res.json(events);
});

app.get('/api/steam', async (req, res) => {
  const events = await getEvents('TU_CALENDAR_ID_STEAM');
  res.json(events);
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
