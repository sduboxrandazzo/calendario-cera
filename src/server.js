// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Para permitir peticiones desde tu front-end

// Aquí almacenaremos los feriados mientras el servidor corra
let feriados = [];

// Obtener todos los feriados
app.get('/api/feriados', (req, res) => {
  res.json(feriados);
});

// Agregar un nuevo feriado
app.post('/api/feriados', (req, res) => {
  const { fecha, titulo } = req.body;
  if (!fecha || !titulo) {
    return res.status(400).json({ error: 'Faltan datos (fecha, titulo)' });
  }
  feriados.push({ fecha, titulo });
  console.log('Feriados ahora:', feriados);
  res.status(201).json({ message: 'Feriado agregado con éxito' });
});

// Eliminar un feriado por índice
app.delete('/api/feriados/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 0 || index >= feriados.length) {
    return res.status(400).json({ error: 'Índice inválido' });
  }
  feriados.splice(index, 1);
  res.status(200).json({ message: 'Feriado eliminado con éxito' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
