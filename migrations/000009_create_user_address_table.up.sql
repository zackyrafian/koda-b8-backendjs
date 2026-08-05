CREATE TABLE user_address(
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  recipient_name VARCHAR(80),
  phone_number VARCHAR(20), 
  recipient_email VARCHAR(40), 
  recipient_address_full TEXT,
  recipient_city VARCHAR(30), 
  recipient_province VARCHAR(30),
  zip_code VARCHAR(8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
