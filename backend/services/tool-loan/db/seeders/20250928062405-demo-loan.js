'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Loans', [
      {
        equipmentId: 1,
        userId: 4, // Carlos Fernández
        startDate: new Date('2025-09-25T10:00:00'),
        endDate: new Date('2025-09-29T10:00:00'),
        status: 'loaned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 2,
        userId: 5, // María López
        startDate: new Date('2025-09-26T12:00:00'),
        endDate: new Date('2025-09-30T12:00:00'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 3,
        userId: 6, // Javier Ramos
        startDate: new Date('2025-09-27T09:00:00'),
        endDate: new Date('2025-10-01T09:00:00'),
        status: 'returned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 4,
        userId: 7, // Ana Torres
        startDate: new Date('2025-09-28T14:00:00'),
        endDate: new Date('2025-10-02T14:00:00'),
        status: 'cancelled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 1,
        userId: 8, // Lucía Mendoza
        startDate: new Date('2025-09-29T08:00:00'),
        endDate: new Date('2025-10-03T08:00:00'),
        status: 'loaned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 2,
        userId: 4,
        startDate: new Date('2025-09-30T10:00:00'),
        endDate: new Date('2025-10-04T10:00:00'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 3,
        userId: 5,
        startDate: new Date('2025-10-01T13:00:00'),
        endDate: new Date('2025-10-05T13:00:00'),
        status: 'loaned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipmentId: 4,
        userId: 6,
        startDate: new Date('2025-10-02T09:30:00'),
        endDate: new Date('2025-10-06T09:30:00'),
        status: 'returned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Loans', null, {});
  }
};
