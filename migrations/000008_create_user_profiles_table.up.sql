CREATE TABLE user_profiles( 
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  fullname VARCHAR(80) NOT NULL,
  image_profile TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
