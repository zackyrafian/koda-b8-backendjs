'use strict';

const now = new Date();

const paymentMethods = [
  ['BCA_VA', 'BCA Virtual Account', 'VA', '88810', 15],
  ['BNI_VA', 'BNI Virtual Account', 'VA', '988', 12],
  ['MANDIRI_VA', 'Mandiri Virtual Account', 'VA', '89508', 13],
  ['BRI_VA', 'BRI Virtual Account', 'VA', '128', 15],
].map(([code, name, type, va_code, va_length]) => ({
  code,
  name,
  type,
  va_code,
  va_length,
  admin_fee: 0,
  is_active: true,
  created_at: now,
  updated_at: now,
}));

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('payment_methods', paymentMethods);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('payment_methods', null, {});
  },
};
