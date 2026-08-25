'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;
    await db.transaction(async (tx) => {
      await db.query(
        `DELETE FROM user_profiles WHERE user_id IN (
           SELECT id FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email)
         )`,
        { transaction: tx }
      );
      await db.query(
        `DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email)`,
        { transaction: tx }
      );
      await queryInterface.addConstraint('users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_unique',
        transaction: tx,
      });
      await queryInterface.changeColumn('products', 'price', {
        type: 'NUMERIC(15,2)',
      }, { transaction: tx });
      await queryInterface.changeColumn('products', 'description', {
        type: 'TEXT',
      }, { transaction: tx });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (tx) => {
      await queryInterface.removeConstraint('users', 'users_email_unique', { transaction: tx });
      await queryInterface.changeColumn('products', 'price', {
        type: 'INTEGER',
      }, { transaction: tx });
      await queryInterface.changeColumn('products', 'description', {
        type: 'STRING',
      }, { transaction: tx });
    });
  }
};
