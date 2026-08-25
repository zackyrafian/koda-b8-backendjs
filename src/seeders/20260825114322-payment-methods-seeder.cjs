'use strict';

const paymentMethods = [
  ['BCA_VA', 'BCA Virtual Account', 'VA', '88810', 15],
  ['BNI_VA', 'BNI Virtual Account', 'VA', '988', 12],
  ['MANDIRI_VA', 'Mandiri Virtual Account', 'VA', '89508', 13],
  ['BRI_VA', 'BRI Virtual Account', 'VA', '128', 15],
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const cols = 5;
    const values = paymentMethods
      .map((_, r) => `(${Array.from({ length: cols }, (_, c) => `$${r * cols + c + 1}`).join(', ')})`)
      .join(', ');
    const binds = paymentMethods.flat();

    await queryInterface.sequelize.query(
      `INSERT INTO payment_methods (code, name, type, va_code, va_length)
       SELECT v.code, v.name, v.type, v.va_code, v.va_length::int
       FROM (VALUES ${values}) AS v(code, name, type, va_code, va_length)
       WHERE NOT EXISTS (SELECT 1 FROM payment_methods pm WHERE pm.code = v.code)`,
      { bind: binds }
    );
  },

  async down(queryInterface) {
    const codes = paymentMethods.map((pm) => pm[0]);
    const values = codes.map((_, i) => `$${i + 1}`).join(', ');

    await queryInterface.sequelize.query(
      `DELETE FROM payment_methods WHERE code IN (${values})`,
      { bind: codes }
    );
  },
};
