'use strict';

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
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const values = brands.map((_, i) => `($${i + 1})`).join(', ');
    await queryInterface.sequelize.query(
      `INSERT INTO brands (name, created_at, updated_at)
       SELECT v.name, NOW(), NOW()
       FROM (VALUES ${values}) AS v(name)
       WHERE NOT EXISTS (SELECT 1 FROM brands b WHERE b.name = v.name)`,
      { bind: brands }
    );
  },

  async down(queryInterface) {
    const values = brands.map((_, i) => `$${i + 1}`).join(', ');
    await queryInterface.sequelize.query(
      `DELETE FROM brands WHERE name IN (${values})`,
      { bind: brands }
    );
  },
};
