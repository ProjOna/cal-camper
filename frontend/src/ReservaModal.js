import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material'; 

const style = { 
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  width: 300, 
  bgcolor: 'background.paper', 
  border: '2px solid #000', 
  boxShadow: 24, p: 4, 
}; 


export default function ReservaModal({ open, handleClose, handleSubmit, defaultStart, defaultEnd, initialData }) { 
  const [nombre, setNombre] = useState(''); 
  const [comentario, setComentario] = useState(''); 
  const [fechaInicio, setFechaInicio] = useState(defaultStart); 
  const [fechaFin, setFechaFin] = useState(defaultEnd); 
  
  useEffect(() => { 
    if (initialData) { 
      setNombre(initialData.title); 
      setComentario(initialData.extendedProps.comentario || ''); 
      setFechaInicio(initialData.extendedProps.fecha_inicio); 
      setFechaFin(initialData.extendedProps.fecha_fin);
    } else { 
      setNombre(''); 
      setComentario(''); 
      setFechaInicio(defaultStart); 
      setFechaFin(defaultEnd); 
    } 
  }, [initialData, defaultStart, defaultEnd]); 
  
  const submit = () => { 
    if (!nombre) return alert("Debes poner un nombre"); 
    if (fechaFin < fechaInicio) return alert("La fecha fin no puede ser menor");
     
    handleSubmit({ 
      nombre, 
      comentario, 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin 
    }); 
  }; 
  
  return ( 
    <Modal open={open} onClose={handleClose}> 
      <Box sx={style}> 
        <h2>{initialData ? 'Editar Reserva' : 'Crear Reserva'}</h2> 
        <p>Fechas: {defaultStart} → {defaultEnd}</p> 
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
        
        <TextField 
          label="Fecha inicio" 
          type="date" 
          fullWidth 
          value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} 
          margin="dense" 
          InputLabelProps={{ shrink: true }} 
        /> 
        
        <TextField 
          label="Fecha fin" 
          type="date" 
          fullWidth 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
          margin="dense" 
          InputLabelProps={{ shrink: true }} 
        />
        
        <Box mt={2} display="flex" justifyContent="space-between"> 
        <Button variant="contained" color="primary" onClick={submit}>
          {initialData ? 'Guardar' : 'Crear'} 
        </Button> 
        <Button variant="outlined" color="secondary" onClick={handleClose}>Cancelar</Button> 
        </Box> 
        </Box> 
        </Modal> 
  );
}