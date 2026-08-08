import { pool } from "../../config/postgres.js";

export async function create(user_id, address_id, cart_items) { 
  const client = await pool.connect()
  try { 
    await client.query('BEGIN')
    
    const total_price = cart_items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    const orderResult = await client.query(
      `INSERT INTO user_orders (user_id, address_id, total_price, status) VALUES ($1, $2, $3, 'PENDING') RETURNING *`,
      [user_id, address_id, total_price]
    )
    const order = orderResult.rows[0]
    
    for (const item of cart_items) { 
      await client.query(
        `INSERT INTO user_order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      )
    }
    
    await client.query('COMMIT')
    return order
  } catch (error) { 
    await client.query('ROLLBACK')
    throw error
  } finally { 
    client.release()
  }
}

export async function findAll(user_id) {
  const values = []; 
  let whereClause = ''; 
  if (user_id !== undefined && user_id !== null) { 
    values.push(user_id)
    whereClause = 'WHERE o.user.id =  $1'
  }
  const { rows } = await pool.query(
    `SELECT 
      o.id,
      o.user_id,
      o.total_price,
      o.status,
      o.created_at,
      o.updated_at,
      json_build_object(
        'id', a.id,
        'recipient_name', a.recipient_name,
        'phone_number', a.phone_number,
        'recipient_email', a.recipient_email,
        'recipient_address_full', a.recipient_address_full,
        'recipient_city', a.recipient_city,
        'recipient_province', a.recipient_province,
        'zip_code', a.zip_code
      ) as address,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) as items
    FROM user_orders o
    LEFT JOIN user_address a ON o.address_id = a.id
    LEFT JOIN user_order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ${whereClause}
    GROUP BY o.id, a.id
    ORDER BY o.created_at DESC`,
    values
  )
  return rows
}

export async function findOne(order_id, user_id) { 
  const { rows } = await pool.query(
    `SELECT 
      o.id,
      o.user_id,
      o.total_price,
      o.status,
      o.created_at,
      o.updated_at,
      json_build_object(
        'id', a.id,
        'recipient_name', a.recipient_name,
        'phone_number', a.phone_number,
        'recipient_email', a.recipient_email,
        'recipient_address_full', a.recipient_address_full,
        'recipient_city', a.recipient_city,
        'recipient_province', a.recipient_province,
        'zip_code', a.zip_code
      ) as address,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) as items,
      json_build_object(
        'id', pay.id,
        'method', pm.name,
        'va_number', pay.va_number,
        'amount', pay.amount,
        'admin_fee', pay.admin_fee,
        'total_amount', pay.total_amount,
        'status', pay.status,
        'expired_at', pay.expired_at,
        'paid_at', pay.paid_at
      ) as payment
    FROM user_orders o
    LEFT JOIN user_address a ON o.address_id = a.id
    LEFT JOIN user_order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN payments pay ON pay.order_id = o.id
    LEFT JOIN payment_methods pm ON pay.payment_method_id = pm.id
    WHERE o.id = $1 AND o.user_id = $2
    GROUP BY o.id, a.id, pay.id, pm.name`,
    [order_id, user_id]
  )
  return rows[0]
}
