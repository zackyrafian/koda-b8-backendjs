import { pool } from "../../config/postgres.js";

export async function findProfile(user_id) { 
  const { rows } = await pool.query(
    `SELECT u.id as id, u.email, up.fullname, up.image_profile
    FROM users as u
    LEFT JOIN 
    user_profiles as up ON u.id = up.user_id WHERE u.id = $1`, [user_id] 
  )
  return rows[0];
}

export async function updateProfile(user_id, data) { 
  const { fullname, phone, picture_path } = data
  console.log(picture_path)
  const { rows } = await pool.query(
    `UPDATE user_profiles
    SET
    fullname = COALESCE($1, fullname),
    image_profile = COALESCE($2, image_profile)
    WHERE user_id = $3`, [fullname, picture_path, user_id]
  )
  return rows[0];
}