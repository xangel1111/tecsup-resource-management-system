import { useState } from 'react';
import { getUser } from '../../auth/auth'
import cubiclesApi from '../../api/cubiclesApi';

const ReservaModal = ({ reservations, cubicle, date, onClose }) => {
  
  const [duration, setDuration] = useState('1');
  const [startTime, setStartTime] = useState('');

  const timeSlots = Array.from({ length: 14 }, (_, i) => 8 + i); // [8,9,...,21]

  // Reservas convertidas a horas ocupadas
  const reservedSlots = reservations
    .filter(r => r.cubicleId === cubicle.id)
    .flatMap(r => {
      const start = new Date(r.startTime);
      const end = new Date(r.endTime);
      const startDate = start.toISOString().split('T')[0];
      if (startDate !== date) return [];

      const hours = [];
      for (let h = start.getHours(); h < end.getHours(); h++) {
        hours.push(h);
      }
      return hours;
    });

  // Filtrar slots disponibles según duración
  const availableSlots = timeSlots.filter(hour => {
    for (let i = 0; i < Number(duration); i++) {
      if (reservedSlots.includes(hour + i) || hour + i > 21) return false;
    }
    return true;
  }).map(h => h.toString().padStart(2, '0') + ':00');

  const handleSubmit = async (e) => {

    e.preventDefault();

    const userId = getUser().id
    const startDateTime = new Date(`${date}T${startTime}:00`);
    console.log(startDateTime);
    //const endDateTime = new Date(startDateTime.getTime() + Number(duration) * 60 * 60 * 1000);

    const reservation = {
      cubicleId: cubicle.id,
      userId: userId,
      startTime: startDateTime.toISOString(),
      hoursReserved: Number(duration)
    };

    console.log(reservation);
    try {
      const result = await cubiclesApi.createReservation(reservation);
      console.log(result);
      alert(`¡Reserva para ${cubicle.nombre} confirmada!`);
      onClose();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Reservar {cubicle.nombre}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Fecha (mostrada, no editable) */}
          <div className="form-group">
            <label>Fecha</label>
            <p className="modal-date">{date}</p>
          </div>

          {/* Duración */}
          <div className="form-group">
            <label htmlFor="duration">Duración</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="modal-select"
            >
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
            </select>
          </div>

          {/* Hora de Inicio */}
          <div className="form-group">
            <label htmlFor="startTime">Hora de Inicio</label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="modal-select"
            >
              <option value="" disabled>Seleccionar hora</option>
              {availableSlots.map(item => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          
          {/* Botones */}
          <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit-modal">
              Reservar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaModal;