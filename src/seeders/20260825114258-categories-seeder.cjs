'use strict';

const categories = [
  'Audio',
  'Periferal',
  'Penyimpanan',
  'Gaming Gear',
  'Streaming & Content Creator',
  'Networking',
  'Power & Cable',
  'Ergonomic & Office',
  'Cooling System',
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const values = categories.map((_, i) => `($${i + 1})`).join(', ');
    await queryInterface.sequelize.query(
      `INSERT INTO categories (name, created_at, updated_at)
       SELECT v.name, NOW(), NOW()
       FROM (VALUES ${values}) AS v(name)
       WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.name = v.name)`,
      { bind: categories }
    );
  },

  async down(queryInterface) {
    const values = categories.map((_, i) => `$${i + 1}`).join(', ');
    await queryInterface.sequelize.query(
      `DELETE FROM categories WHERE name IN (${values})`,
      { bind: categories }
    );
  },
};
