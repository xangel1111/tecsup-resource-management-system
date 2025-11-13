'use strict';

function generateLoans() {
  const loans = [];
  const studentUserIds = [4, 5, 6, 7, 8];
  const equipmentIds = [1, 2, 3, 4];
  
  // Definimos "Hoy" para calcular qué es pasado y qué es presente
  const today = new Date();
  
  // Vamos a generar datos desde hace 3 meses hasta hoy
  // Meses: Agosto (7), Septiembre (8), Octubre (9), Noviembre (10)
  // Nota: En JS los meses van de 0 a 11.
  const monthsToGenerate = [7, 8, 9, 10]; 

  for (let month of monthsToGenerate) {
    // Días del mes (1 al 28 para no complicarnos con febrero/bisiestos en un seeder simple)
    for (let day = 1; day <= 28; day++) {
      
      // Saltamos algunos días para que no sea tan uniforme (más realista)
      if (Math.random() > 0.7) continue;

      // Generar entre 1 y 3 préstamos por día activo
      const numLoans = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numLoans; i++) {
        
        // --- 1. REGLA DE ORO: FECHAS ---
        // Fecha de inicio aleatoria entre 8am y 6pm
        const startDate = new Date(2025, month, day, 8 + Math.floor(Math.random() * 10), 0, 0);
        
        // Fecha fin: SIEMPRE startDate + 4 días exactos
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);

        // --- 2. REGLA DE ESTADOS SEGÚN EL TIEMPO ---
        let status = '';

        // Comparamos con "Hoy" (simulado o real)
        // Para efectos del seeder, asumiremos que el código se corre cerca de Noviembre 2025
        // O usamos la fecha real del sistema si estás probando hoy.
        // Usaremos timestamps para comparar
        
        const nowTime = today.getTime(); 
        const endTime = endDate.getTime();

        if (endTime < nowTime) {
          // CASO A: El plazo de 4 días YA TERMINÓ (Pasado)
          
          // 80% de probabilidad de que lo hayan devuelto bien
          // 10% de que lo cancelaron
          // 10% de que se quedaron con él y está RETRASADO (Overdue)
          const rand = Math.random();
          if (rand < 0.80) {
            status = 'returned';
          } else if (rand < 0.90) {
            status = 'cancelled';
          } else {
            status = 'overdue'; // <--- Aquí generamos la mora
          }

        } else {
          // CASO B: Aún estamos dentro de los 4 días (Presente/Futuro cercano)
          // El préstamo está activo o pendiente
          status = Math.random() < 0.8 ? 'loaned' : 'pending';
        }

        // Ajuste: Si la fecha es MUY vieja (ej: Agosto) y salió 'overdue', 
        // mejor lo ponemos 'returned' para no tener morosos de hace 3 meses en el dashboard actual,
        // a menos que quieras simular que alguien robó el equipo.
        // Dejémoslo así para que aparezcan en el historial.

        loans.push({
          equipmentId: equipmentIds[Math.floor(Math.random() * equipmentIds.length)],
          userId: studentUserIds[Math.floor(Math.random() * studentUserIds.length)],
          startDate: startDate,
          endDate: endDate, // Siempre +4 días
          status: status,
          createdAt: new Date(), // Fecha de creación simulada
          updatedAt: new Date(),
        });
      }
    }
  }
  return loans;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const loans = generateLoans();
    return queryInterface.bulkInsert('Loans', loans, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Loans', null, {});
  }
};