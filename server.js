const express = require('express');
const path = require('path');
const { getEvents } = require('./calendar'); // tu módulo calendar.js

const app = express();

// Render asigna automáticamente un puerto en la variable de entorno PORT
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para Biblioteca
app.get('/api/biblioteca', async (req, res) => {
  try {
    const events = await getEvents('informatica7733@gmail.com'); // Calendar ID real de Biblioteca
    res.json(events);
  } catch (err) {
    console.error('Error en /api/biblioteca:', err);
    res.status(500).json({ error: 'No se pudieron obtener los eventos de Biblioteca' });
  }
});

// Endpoint para Sala STEAM
app.get('/api/steam', async (req, res) => {
  try {
    const events = await getEvents('tutoria.preceptoria.escuela7733@gmail.com'); // Calendar ID real de STEAM
    res.json(events);
  } catch (err) {
    console.error('Error en /api/steam:', err);
    res.status(500).json({ error: 'No se pudieron obtener los eventos de STEAM' });
  }
});

// Rutas para páginas HTML (si las tenés en public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/biblioteca', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

app.get('/steam', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'steam.html'));
});

app.get('/recursos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recursos.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
