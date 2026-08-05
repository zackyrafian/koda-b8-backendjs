CREATE TABLE user_order_items(
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES user_orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
