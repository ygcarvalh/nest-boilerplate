'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password_hash: passwordHash,
        created_at: now,
        updated_at: now,
      },
      {
        email: 'user@example.com',
        password_hash: passwordHash,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'user@example.com'],
    });
  },
};
