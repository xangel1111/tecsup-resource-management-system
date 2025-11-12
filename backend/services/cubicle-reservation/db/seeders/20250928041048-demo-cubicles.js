'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cubicles', [
      { name: 'Cubicle 1', capacity: 4, location: 'Library', status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cubicle 2', capacity: 4, location: 'Library', status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cubicle 3', capacity: 4, location: 'Library', status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cubicle 4', capacity: 4, location: 'Library', status: 'available', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CUBICLE', null, {});
  }
};