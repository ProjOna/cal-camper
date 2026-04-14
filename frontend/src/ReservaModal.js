import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const ReservaModal = ({ open, handleClose, handleSubmit, defaultStart, defaultEnd, initialData }) => {
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');

  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.title || '');
      setComentario(initialData.extendedProps?.comentario || '');
    }

    if (defaultStart && defaultEnd) {
      setRange([{
        startDate: new Date(defaultStart),
        endDate: new Date(defaultEnd),
        key: 'selection'
      }]);
    }
  }, [defaultStart, defaultEnd, initialData]);

  if (!open) return null;

  const handleSave = () => {
    handleSubmit({
      nombre,
      comentario,
      fecha_inicio: range[0].startDate.toISOString().split('T')[0],
      fecha_fin: range[0].endDate.toISOString().split('T')[0]
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>{initialData ? 'Editar reserva ✏️' : 'Nueva reserva 🚐'}</h2>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          placeholder="Comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <DateRange
          editableDateInputs={true}
          onChange={item => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />

        <div className="modal-buttons">
          <button onClick={handleClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>

      </div>
    </div>
  );
};

export default ReservaModal;