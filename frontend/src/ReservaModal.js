import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  maxWidth: '95%',
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 3,
};

export default function ReservaModal({ open, handleClose, handleSubmit, defaultStart, defaultEnd, initialData }) {

  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');

  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.title);
      setComentario(initialData.extendedProps?.comentario || '');

      setRange([{
        startDate: new Date(initialData.extendedProps.fecha_inicio),
        endDate: new Date(initialData.extendedProps.fecha_fin),
        key: 'selection'
      }]);
    } else if (defaultStart && defaultEnd) {
      setRange([{
        startDate: new Date(defaultStart),
        endDate: new Date(defaultEnd),
        key: 'selection'
      }]);
    }
  }, [initialData, defaultStart, defaultEnd]);

  const submit = () => {
    if (!nombre) return alert("Debes poner un nombre");

    const start = range[0].startDate;
    const end = range[0].endDate;

    if (end < start) return alert("La fecha fin no puede ser menor");

    handleSubmit({
      nombre,
      comentario,
      fecha_inicio: start.toISOString().split('T')[0],
      fecha_fin: end.toISOString().split('T')[0]
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>

        <h2 style={{ marginTop: 0 }}>
          {initialData ? 'Editar reserva ✏️' : 'Nueva reserva 🚐'}
        </h2>

        <TextField
          label="Nombre"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="dense"
        />

        <TextField
          label="Comentario"
          fullWidth
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          margin="dense"
        />

        {/* 💥 SELECTOR PRO */}
        <div style={{ marginTop: '10px' }}>
          <DateRange
            editableDateInputs={true}
            onChange={item => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
        </div>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={submit}>
            {initialData ? 'Guardar' : 'Crear'}
          </Button>

          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
        </Box>

      </Box>
    </Modal>
  );
}