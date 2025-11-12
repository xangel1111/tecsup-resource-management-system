'use strict';

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Reservations', [
      {
        userId: 4, // Carlos Fernández
        cubicleId: 1,
        startTime: new Date('2025-10-01T09:00:00'),
        endTime: new Date('2025-10-01T11:00:00'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5, // María López
        cubicleId: 2,
        startTime: new Date('2025-10-01T12:00:00'),
        endTime: new Date('2025-10-01T14:00:00'),
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6, // Javier Ramos
        cubicleId: 3,
        startTime: new Date('2025-10-02T10:00:00'),
        endTime: new Date('2025-10-02T12:00:00'),
        status: 'declined',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7, // Ana Torres
        cubicleId: 4,
        startTime: new Date('2025-10-02T14:00:00'),
        endTime: new Date('2025-10-02T16:00:00'),
        status: 'cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8, // Lucía Mendoza
        cubicleId: 1,
        startTime: new Date('2025-10-03T09:00:00'),
        endTime: new Date('2025-10-03T11:00:00'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        cubicleId: 2,
        startTime: new Date('2025-10-03T12:00:00'),
        endTime: new Date('2025-10-03T14:00:00'),
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        cubicleId: 3,
        startTime: new Date('2025-10-04T10:00:00'),
        endTime: new Date('2025-10-04T12:00:00'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        cubicleId: 4,
        startTime: new Date('2025-10-04T14:00:00'),
        endTime: new Date('2025-10-04T16:00:00'),
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8,
        cubicleId: 1,
        startTime: new Date('2025-10-05T09:00:00'),
        endTime: new Date('2025-10-05T11:00:00'),
        status: 'declined',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        cubicleId: 2,
        startTime: new Date('2025-10-05T12:00:00'),
        endTime: new Date('2025-10-05T14:00:00'),
        status: 'cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('RESERVATION', null, {});
  }
};
