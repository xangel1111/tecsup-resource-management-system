'use strict';
// /seeders/XXXX-reservations.js

// --- Función Helper para generar datos realistas ---
function generateReservations() {
  const reservations = [];
  const studentUserIds = [4, 5, 6, 7, 8]; // IDs de tus estudiantes
  const cubicleIds = [1, 2, 3, 4];
  const statuses = ['accepted', 'accepted', 'accepted', 'cancelled', 'pending', 'declined']; // Más aceptadas

  // Meses: Septiembre (8), Octubre (9), Noviembre (10)
  for (let month of [8, 9, 10]) {
    // Generar reservas para cada día del mes
    for (let day = 1; day <= 30; day++) {
      // Simular días más ocupados (ej: entre semana)
      const dayOfWeek = new Date(2025, month, day).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Omitir fines de semana

      // Generar N reservas por día
      const numReservations = Math.floor(Math.random() * 8) + 4; // Entre 4 y 12 reservas/día
      for (let i = 0; i < numReservations; i++) {
        
        // --- Simular Horas Pico ---
        // 40% chance de ser en la mañana (pico a las 10am)
        // 60% chance de ser en la tarde (pico a las 3pm)
        let startHour;
        if (Math.random() < 0.4) {
          startHour = Math.floor(Math.random() * 3) + 9; // 9, 10, 11
        } else {
          startHour = Math.floor(Math.random() * 3) + 14; // 14, 15, 16
        }
        
        const duration = Math.random() < 0.7 ? 2 : 1; // 70% chance de 2 horas

        const startTime = new Date(2025, month, day, startHour, 0, 0);
        const endTime = new Date(2025, month, day, startHour + duration, 0, 0);

        reservations.push({
          userId: studentUserIds[Math.floor(Math.random() * studentUserIds.length)],
          cubicleId: cubicleIds[Math.floor(Math.random() * cubicleIds.length)],
          startTime: startTime,
          endTime: endTime,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }
  return reservations;
}

// --- Fin de la Función Helper ---


module.exports = {
  async up(queryInterface, Sequelize) {
    const reservations = generateReservations();
    return queryInterface.bulkInsert('Reservations', reservations, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Reservations', null, {});
  }
};