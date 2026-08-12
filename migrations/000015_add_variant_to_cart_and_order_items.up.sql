ALTER TABLE user_carts
  ADD COLUMN variant VARCHAR(40);

ALTER TABLE user_order_items
  ADD COLUMN variant VARCHAR(40);
