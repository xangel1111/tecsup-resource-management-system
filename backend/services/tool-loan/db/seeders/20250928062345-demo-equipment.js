'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Equipment', [
      {
        name: 'Laptop Dell',
        description: 'Laptop para desarrollo y pruebas',
        quantity: 5,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Projector Epson',
        description: 'Proyector para presentaciones',
        quantity: 2,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Router Cisco',
        description: 'Router para prácticas de redes',
        quantity: 3,
        status: 'loaned',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cable HDMI',
        description: 'Cables HDMI de 2 metros',
        quantity: 10,
        status: 'unavailable',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Equipments', null, {});
  }
};
