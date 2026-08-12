ALTER TABLE user_order_items
  DROP COLUMN IF EXISTS variant;

ALTER TABLE user_carts
  DROP COLUMN IF EXISTS variant;
