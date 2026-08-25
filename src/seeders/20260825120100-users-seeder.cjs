'use strict';

const now = new Date();

const users = [
  {
    email: 'admin@admin.com',
    password:
      '$argon2id$v=19$m=65536,p=4,t=3$iUSVMupMWXv++PYGqGd/Qw$4G2vWbOhEMn+ivjomZ4TjVDzp/HwT32S3ZK60xpbt68',
    role: 'ADMIN',
    created_at: now,
    updated_at: now,
  },
];

const userProfiles = [
  { user_id: 1, fullname: 'Admin', created_at: now, updated_at: now },
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', users);
    await queryInterface.bulkInsert('user_profiles', userProfiles);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
