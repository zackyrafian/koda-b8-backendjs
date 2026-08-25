'use strict';

const now = new Date();

const categories = [
  'Audio',
  'Aksesoris Komputer',
  'Periferal',
  'Penyimpanan',
  'Gaming Gear',
  'Streaming & Content Creator',
  'Networking',
  'Power & Cable',
  'Ergonomic & Office',
  'Cooling System',
].map((name) => ({ name, created_at: now, updated_at: now }));

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', categories);
    await queryInterface.bulkDelete('categories', { id: 2 });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
