import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import ReservaModal from './ReservaModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import esLocale from '@fullcalendar/core/locales/es';


const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: '', end: '' });

const colors = ['#f94144','#f3722c','#f9c74f','#90be6d','#43aa8b','#577590','#8d99ae'];
const [editingEvent, setEditingEvent] = useState(null);
const getColor = (nombre) => {
  // genera un hash simple para que siempre sea el mismo color para la misma persona
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const renderEventContent = (eventInfo) => {
  const { comentario, fecha_inicio, fecha_fin } = eventInfo.event.extendedProps;

  const handleDelete = async (e) => {
    e.stopPropagation(); // evita abrir otras cosas
    if (!window.confirm("¿Eliminar reserva?")) return;

    try {
      await axios.delete(`http://localhost:3000/reservas/${eventInfo.event.id}`);
      fetchReservas();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();

    // abrimos modal con datos actuales
    setSelectedRange({
      start: fecha_inicio,
      end: fecha_fin
    });

    setEditingEvent(eventInfo.event); // esto lo creamos ahora
    setModalOpen(true);
  };

  return (
    <Tippy content={`Comentario: ${comentario || '—'}\n${fecha_inicio} → ${fecha_fin}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{eventInfo.event.title}</span>

        <div style={{ marginLeft: '5px' }}>
          <button onClick={handleEdit} style={{ marginRight: '4px' }}>✏️</button>
          <button onClick={handleDelete}>❌</button>
        </div>
      </div>
    </Tippy>
  );
};

  const fetchReservas = async () => {
    try {
        const res = await axios.get('http://localhost:3000/reservas');
        const mapped = res.data.map(r => ({
        id: r.id,
        title: r.nombre,
        start: r.fecha_inicio,
        end: new Date(new Date(r.fecha_fin).getTime() + 86400000).toISOString().split('T')[0],
        allDay: true,
        backgroundColor: getColor(r.nombre),
        borderColor: getColor(r.nombre),
        extendedProps: {
            comentario: r.comentario,
            fecha_inicio: r.fecha_inicio,
            fecha_fin: r.fecha_fin
        }
        }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

const handleDateClick = (info) => {
  // tratamos un click como rango de un solo día
  setSelectedRange({
    start: info.dateStr,
    end: info.dateStr
  });
  setModalOpen(true);
};

const handleSelect = (selectInfo) => {
  setSelectedRange({
    start: selectInfo.startStr,
    end: new Date(new Date(selectInfo.endStr).getTime() - 86400000).toISOString().split('T')[0]
  });
  setModalOpen(true);
};

const submitReserva = async ({ nombre, comentario, fecha_inicio, fecha_fin }) => {
  try {
    if (editingEvent) {
      // EDITAR
      await axios.put(`http://localhost:3000/reservas/${editingEvent.id}`, {
        nombre,
        comentario,
        fecha_inicio,
        fecha_fin
      });
    } else {
      // CREAR
      await axios.post('http://localhost:3000/reservas', {
        nombre,
        comentario,
        fecha_inicio,
        fecha_fin
      });
    }

    fetchReservas();
    setModalOpen(false);
    setEditingEvent(null);

  } catch (err) {
    alert(err.response?.data || "Error");
  }
};

  return (
    <div>
      <h1>Calendario Camper Familia 🚐</h1>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={true}
            select={handleSelect}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            firstDay={1} // lunes es el primer día
            locale={esLocale}
            />
      <ReservaModal
  open={modalOpen}
  handleClose={() => {
    setModalOpen(false);
    setEditingEvent(null);
  }}
  handleSubmit={submitReserva}
  defaultStart={selectedRange.start}
  defaultEnd={selectedRange.end}
  initialData={editingEvent}
/>
    </div>
  );
};

export default Calendario;