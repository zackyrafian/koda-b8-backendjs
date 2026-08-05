CREATE TABLE product_variants( 
  id BIGSERIAL PRIMARY KEY, 
  name VARCHAR(40) NOT NULL, 
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
