'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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

    await queryInterface.bulkInsert('roles', [
      { name: 'USER', created_at: new Date(), updated_at: new Date() },
      { name: 'ADMIN', created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      references: { model: 'roles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.sequelize.query(
      `UPDATE users SET role_id = (SELECT id FROM roles WHERE name = users.role) WHERE role_id IS NULL AND role IS NOT NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'USER') WHERE role_id IS NULL`
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role_id');
    await queryInterface.dropTable('roles');
  }
};
