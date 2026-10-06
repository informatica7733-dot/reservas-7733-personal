const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Horarios fijos
const horarios = [
  "07:45 - 08:25", "08:25 - 09:05", "09:15 - 09:55", "09:55 - 10:35",
  "10:45 - 11:25", "11:25 - 12:05", "12:05 - 12:45", "12:45 - 13:25",
  "13:30 - 14:10", "14:10 - 14:50", "15:00 - 15:40", "15:40 - 16:20",
  "16:30 - 17:10", "17:10 - 17:50", "17:50 - 18:30", "18:30 - 19:10"
];

// Archivo donde guardamos todas las reservas
const FILE = "reservas.json";

// Cargar reservas existentes
let reservas = [];
if (fs.existsSync(FILE)) {
  reservas = JSON.parse(fs.readFileSync(FILE));
}

// Endpoint: listar reservas (todas o por recurso)
app.get("/reservas", (req, res) => {
  const { recurso } = req.query;
  if (recurso) {
    return res.json(reservas.filter(r => r.recurso === recurso));
  }
  res.json(reservas);
});

// Endpoint: crear reserva
app.post("/reservas", (req, res) => {
  const { recurso, docente, curso, fecha, horario, recursos } = req.body;

  // Validar horario
  if (!horarios.includes(horario)) {
    return res.status(400).json({ error: "Horario inválido" });
  }

  // Validar conflicto
  const existe = reservas.find(r =>
    r.recurso === recurso &&
    r.fecha === fecha &&
    r.horario === horario
  );
  if (existe) {
    return res.status(400).json({ error: "Ese horario ya está reservado" });
  }

  // Validar notebooks
  if (recursos?.notebooks > 20) {
    return res.status(400).json({ error: "Máximo 20 notebooks" });
  }

  // Crear nueva reserva
  const nueva = {
    id: reservas.length + 1,
    recurso,
    docente,
    curso,
    fecha,
    horario,
    recursos
  };

  reservas.push(nueva);
  fs.writeFileSync(FILE, JSON.stringify(reservas, null, 2));
  res.json(nueva);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
