'use strict';
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `INSERT INTO roles (name, created_at, updated_at)
       VALUES ('USER', NOW(), NOW()), ('ADMIN', NOW(), NOW())
       ON CONFLICT (name) DO NOTHING`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM roles WHERE name IN ('USER', 'ADMIN')`
    );
  }
};
