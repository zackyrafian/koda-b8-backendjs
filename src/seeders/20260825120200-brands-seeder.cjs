'use strict';

const now = new Date();

const brands = [
  'SoundWare',
  'LogiTech',
  'HyperGear',
  'Vortex',
  'ApexTech',
  'RazerBlade',
  'CorsairX',
  'SteelSeries',
  'ZowieGear',
  'ElgatoPro',
].map((name) => ({ name, created_at: now, updated_at: now }));

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('brands', brands);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', null, {});
  },
};
