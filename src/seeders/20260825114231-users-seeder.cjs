'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const seq = queryInterface.sequelize;

    await seq.query(
      `INSERT INTO users (email, password, role, created_at, updated_at)
       VALUES (
         'admin@admin.com',
         '$argon2id$v=19$m=65536,p=4,t=3$iUSVMupMWXv++PYGqGd/Qw$4G2vWbOhEMn+ivjomZ4TjVDzp/HwT32S3ZK60xpbt68',
         'ADMIN',
         NOW(),
         NOW()
       )
       ON CONFLICT (email) DO NOTHING`
    );

    await seq.query(
      `UPDATE users
       SET role = 'ADMIN',
           role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
       WHERE email = 'admin@admin.com'`
    );

    await seq.query(
      `INSERT INTO user_profiles (user_id, fullname, created_at, updated_at)
       SELECT u.id, 'Admin', NOW(), NOW()
       FROM users u
       WHERE u.email = 'admin@admin.com'
         AND NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.user_id = u.id)`
    );
  },

  async down(queryInterface) {
    const seq = queryInterface.sequelize;
    await seq.query(
      `DELETE FROM user_profiles
       WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@admin.com')`
    );
    await seq.query(`DELETE FROM users WHERE email = 'admin@admin.com'`);
  },
};
