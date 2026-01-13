'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const roles = [
      { name: 'admin', created_at: now, updated_at: now },
      { name: 'user', created_at: now, updated_at: now },
    ];

    const permissions = [
      { name: 'users.create', description: 'Create users' },
      { name: 'users.read', description: 'Read users' },
      { name: 'users.update', description: 'Update users' },
      { name: 'users.delete', description: 'Delete users' },
      { name: 'roles.create', description: 'Create roles' },
      { name: 'roles.read', description: 'Read roles' },
      { name: 'roles.update', description: 'Update roles' },
      { name: 'roles.delete', description: 'Delete roles' },
      { name: 'permissions.read', description: 'Read permissions' },
      { name: 'system.theme.update', description: 'Change system theme' },
      { name: 'system.icon.update', description: 'Change system icon' },
    ].map((permission) => ({
      ...permission,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('roles', roles);
    await queryInterface.bulkInsert('permissions', permissions);

    const adminPermissions = permissions.map((permission) => ({
      role_name: 'admin',
      permission_name: permission.name,
      created_at: now,
      updated_at: now,
    }));

    const userPermissions = [
      {
        role_name: 'user',
        permission_name: 'users.read',
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('role_permissions', [
      ...adminPermissions,
      ...userPermissions,
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', {});
    await queryInterface.bulkDelete('permissions', {});
    await queryInterface.bulkDelete('roles', {});
  },
};
