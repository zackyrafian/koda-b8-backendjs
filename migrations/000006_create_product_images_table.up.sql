CREATE TABLE product_images( 
  id BIGSERIAL PRIMARY KEY, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
