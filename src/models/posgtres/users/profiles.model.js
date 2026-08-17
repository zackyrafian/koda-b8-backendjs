import { pool } from "../../config/postgres.js";

export async function findProfile(user_id) { 
  const { rows } = await pool.query(
    `SELECT u.id as id, u.email, up.fullname, up.phone_number, up.date_of_birth, up.gender ,up.image_profile
    FROM users as u
    LEFT JOIN 
    user_profiles as up ON u.id = up.user_id WHERE u.id = $1`, [user_id] 
  )
  return rows[0];
}

export async function updateProfile(user_id, data) {
  const { fullname, email, phone_number, date_of_birth, gender, picture_path } = data

  if (email) {
    await pool.query(
      `UPDATE users SET email = $1 WHERE id = $2`, [email, user_id]
    )
  }
  
  const { rows } = await pool.query(
    `UPDATE user_profiles
    SET
    fullname = COALESCE($1, fullname),
    phone_number = COALESCE($2, phone_number),
    date_of_birth = COALESCE($3, date_of_birth),
    gender = COALESCE($4, gender),
    image_profile = COALESCE($5, image_profile)
    WHERE user_id = $6`, [fullname, phone_number, date_of_birth, gender, picture_path, user_id]
  )
  return rows[0];
}