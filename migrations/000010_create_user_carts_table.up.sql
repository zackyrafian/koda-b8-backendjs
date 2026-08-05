CREATE TABLE user_carts(
  id BIGSERIAL PRIMARY KEY, 
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE, 
  quantity INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
