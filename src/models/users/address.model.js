import { pool } from "../../config/postgres.js";

export async function create(user_id ,request) { 
  const { rows } = await pool.query(
    `INSERT INTO user_address (
      user_id,
      recipient_name,
      phone_number,
      recipient_email,
      recipient_address_full,
      recipient_city,
      recipient_province,
      zip_code,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`, [
    user_id,
    request.recipient_name,
    request.phone_number,
    request.recipient_email,
    request.recipient_address_full,
    request.recipient_city,
    request.recipient_province,
    request.zip_code
    ]
  )
  return rows[0];
}