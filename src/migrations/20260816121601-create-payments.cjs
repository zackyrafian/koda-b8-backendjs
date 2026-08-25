'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      payment_method_id: {
        type: Sequelize.INTEGER
      },
      va_number: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      admin_fee: {
        type: Sequelize.DECIMAL
      },
      total_amount: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.STRING
      },
      expired_at: {
        type: Sequelize.DATE
      },
      paid_at: { 
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};