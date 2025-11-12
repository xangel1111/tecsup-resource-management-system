'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Encripta la contraseña "admin" antes de insertar
    const hashedPassword = 'admin';

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Administrador General',
        email: 'admin@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // suponiendo que 1 = admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biblioteca',
        email: 'biblioteca@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // por ejemplo 2 = staff o algo similar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Redes',
        email: 'redes@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 1, // mismo rol o diferente si lo prefieres
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // === Usuarios Normales (Estudiantes) ===
      {
        name: 'Rojan Fernández',
        email: 'rojan.lopez@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2, // student
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'María López',
        email: 'maria.lopez@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Javier Ramos',
        email: 'javier.ramos@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ana Torres',
        email: 'ana.torres@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lucía Mendoza',
        email: 'lucia.mendoza@tecsup.edu.pe',
        password: hashedPassword,
        roleId: 2,
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
