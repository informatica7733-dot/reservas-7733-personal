const fs = require('fs');
const { google } = require('googleapis');

async function getEvents(calendarId) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.list({
    calendarId: calendarId,
    timeMin: new Date().toISOString(),
    timeMax: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return res.data.items.map(event => ({
    fecha: event.start.dateTime || event.start.date,
    hora: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString() : '',
    usuario: event.summary,
  }));
}

module.exports = { getEvents };
