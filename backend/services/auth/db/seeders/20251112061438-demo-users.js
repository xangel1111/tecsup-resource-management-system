'use strict';
// /seeders/XXXX-users.js

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = 'admin'; // En producción, deberías hashear esto

    // Primero, asegura que la columna 'carrera' exista
    // Puedes correr esto en una migración separada o aquí para asegurarte
    try {
      await queryInterface.addColumn('Users', 'carrera', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (e) {
      console.log("Columna 'carrera' ya existe, omitiendo adición.");
    }

    await queryInterface.bulkInsert('Users', [
      // === Admin/Staff ===
      {
        name: 'Administrador General',
        email: 'admin@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // admin
        carrera: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Administrador Cubículos',
        email: 'biblioteca@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // admin
        carrera: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'Administrador Redes',
        email: 'redes@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // admin
        carrera: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... (otros admins)
      // === Estudiantes ===
      {
        name: 'Rojan Fernández',
        email: 'rojan.lopez@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2, // student
        carrera: 'Redes y Comunicaciones', // <-- DATO AÑADIDO
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'María López',
        email: 'maria.lopez@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        carrera: 'Diseño y Desarrollo de Software', // <-- DATO AÑADIDO
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Javier Ramos',
        email: 'javier.ramos@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        carrera: 'Mecatrónica Industrial', // <-- DATO AÑADIDO
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ana Torres',
        email: 'ana.torres@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        carrera: 'Mecatrónica Industrial', // <-- DATO AÑADIDO
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lucía Mendoza',
        email: 'lucia.mendoza@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        carrera: 'Aviónica y Mecánica Aeronáutica', // <-- DATO AÑADIDO
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: [
        'admin@tecsup.edu.pe',
        'biblioteca@tecsup.edu.pe',
        'redes@tecsup.edu.pe',
        'carlos.fernandez@tecsup.edu.pe',
        'maria.lopez@tecsup.edu.pe',
        'javier.ramos@tecsup.edu.pe',
        'ana.torres@tecsup.edu.pe',
        'lucia.mendoza@tecsup.edu.pe'
      ]
    });
  }
};
