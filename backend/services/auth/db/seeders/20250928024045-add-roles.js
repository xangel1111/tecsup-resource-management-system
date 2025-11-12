'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'student', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
