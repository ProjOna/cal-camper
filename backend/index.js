require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Camper funcionando 🚐');
});

app.get('/reservas', (req, res) => {
  db.query('SELECT * FROM reservas', (err, results) => {
    if (err) return res.status(500).send(err);

    const formatted = results.map(r => ({
      ...r,
      fecha_inicio: r.fecha_inicio.getFullYear() + '-' + String(r.fecha_inicio.getMonth()+1).padStart(2,'0') + '-' + String(r.fecha_inicio.getDate()).padStart(2,'0'),
      fecha_fin: r.fecha_fin.getFullYear() + '-' + String(r.fecha_fin.getMonth()+1).padStart(2,'0') + '-' + String(r.fecha_fin.getDate()).padStart(2,'0')
    }));

    res.json(formatted);
  });
});

app.post('/reservas', (req, res) => {
  const { nombre, fecha_inicio, fecha_fin, comentario } = req.body;

  const checkQuery = `
    SELECT * FROM reservas
    WHERE (
      fecha_inicio <= ? AND fecha_fin >= ?
    )
  `;

  db.query(checkQuery, [fecha_fin, fecha_inicio], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      return res.status(400).send('Fechas ya reservadas');
    }

    const insertQuery = `
      INSERT INTO reservas (nombre, fecha_inicio, fecha_fin, comentario)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [nombre, fecha_inicio, fecha_fin, comentario], (err) => {
      if (err) return res.status(500).send(err);

      res.send('Reserva creada correctamente');
    });
  });
});

app.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM reservas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);

    res.send('Reserva eliminada');
  });
});

app.put('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_inicio, fecha_fin, comentario } = req.body;

  const query = `
    UPDATE reservas
    SET nombre = ?, fecha_inicio = ?, fecha_fin = ?, comentario = ?
    WHERE id = ?
  `;

  db.query(query, [nombre, fecha_inicio, fecha_fin, comentario, id], (err) => {
    if (err) return res.status(500).send(err);

    res.send('Reserva actualizada');
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en puerto ${PORT}`);
});