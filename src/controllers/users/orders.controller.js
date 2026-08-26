import generateVA  from "../../utils/va.js"
import sq, { Sequelize } from '../../models/index.js'
import { paginationMeta, paginationOptions, parsePagination } from "../../utils/pagination.js"
import { sendSuccess } from "../../utils/response.js"

export async function create(req, res) { 
  const io = req.app.get("io")
  const user_id = req.user.userId
  const { cart_id, address_id, payment_method_id } = req.body

  let tx;
  let orderData = null;
  try { 
    tx = await sq.sequelize.transaction();
    const user = await sq.User.findByPk(user_id, { 
      include: [{ model: sq.UserProfile, as: 'profile' }],
      transaction: tx
    })
    if (!user) { 
      await tx.rollback()
      return res.status(404).json({ 
        success: false, 
        message: "user not found."
      })
    }
    
    if (!cart_id || cart_id.length === 0) { 
      await tx.rollback()
      return res.status(400).json({ 
        "success": false, 
        "message": "cart_id is required"
      })
    }

    if (!address_id) { 
      await tx.rollback()
      return res.status(400).json({ 
        "success": false, 
        "message": "address_id is required"
      })
    }

    const [address, paymentMethod] = await Promise.all([
      sq.UserAddress.findOne({ 
        where: {id: address_id, user_id},
        transaction: tx
      }),
      sq.PaymentMethods.findOne({ where: { id: payment_method_id, is_active: true }, transaction: tx })
    ])
    if (!address) { 
      await tx.rollback()
      return res.status(404).json({ 
        "success": false, 
        "message": "Address not found"
      })
    }
    if (!paymentMethod) {
      await tx.rollback()
      return res.status(404).json({
        "success": false,
        "message": "Payment method not found"
      })
    }

    const cart_items = await sq.UserCart.findAll({ 
      where: { user_id, id: cart_id }, 
      include: [{ model: sq.Products, as: 'products' }],
      transaction: tx
    })

    if (cart_items.length === 0) { 
      await tx.rollback()
      return res.status(404).json({ 
        "success": false, 
        "message": "No cart items found"
      })
    }

    const items = cart_items.map(item => ({ 
      id: item.id, 
      user_id: item.user_id, 
      product_id: item.product_id, 
      variant: item.variant, 
      quantity: item.quantity, 
      price: item.products?.price
    }))

    const total_price = cart_items.reduce((sum, item) => {
     return sum + (Number(item.products.price) * item.quantity) 
    }, 0)

    const order = await sq.UserOrders.create({ 
      user_id, 
      address_id, 
      total_price,
    }, { transaction: tx })

    await sq.UserOrderItems.bulkCreate( 
      items.map(item => ({ 
        order_id: order.id, 
        product_id: item.product_id, 
        variant: item.variant, 
        quantity: item.quantity, 
        price: item.price
      })),
      { transaction: tx }
    )

    const vaNumber = paymentMethod.va_code ? generateVA(paymentMethod, order.id) : null;
    const totalAmount = Number(order.total_price) + Number(paymentMethod.admin_fee)
    
    const payment = await sq.Payments.create({
      order_id: order.id,
      payment_method_id: paymentMethod.id,
      va_number: vaNumber,
      amount: order.total_price,
      admin_fee: paymentMethod.admin_fee,
      total_amount: totalAmount,
      expired_at: new Date(Date.now() + 24 * 3600 * 1000)
    }, { transaction: tx })

    orderData = {
      ...order.toJSON(),
      user: {
        email: user.email, 
        fullname: user.profile?.fullname,
      },
      payment: {
        method: paymentMethod.name,
        va_number: payment.va_number,
        total_amount: payment.total_amount,
        expired_at: payment.expired_at
      }, 
      items: cart_items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name,
        variant: item.variant,
        quantity: item.quantity,
        price: item.products?.price
      }))
    }      
    
    await sq.UserCart.destroy({
      where: { id: cart_id, user_id },
      transaction: tx
    })

    await Promise.all(
      items.map(item => 
        sq.Products.increment(
          { sold_out: item.quantity, stock: -item.quantity }, 
          { where: { id: item.product_id }, transaction: tx }
        )
      )
    )

    await tx.commit()
  } catch (error) { 
    if (tx) await tx.rollback()
    return res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }

  io.emit("new_orders", { 
    success: true, 
    results: orderData
  })
  res.status(201).json({ 
    "success": true, 
    "message": "Order created successfully",
    "results": orderData,
  })
}


export async function getAll(req, res) { 
  const { userId, role } = req.user
  const user_id = parseInt(userId)
  const { pageNum, limitNum, paginate } = parsePagination(req.query)
  try { 
    const where = role === 'ADMIN' ? {} : { user_id }
    const queryOptions = { 
      where,
      include: [
        {
          model: sq.User, 
          as: 'user', 
          attributes: ['id', 'email'], 
          include: [{ model: sq.UserProfile, as: 'profile', attributes: ['fullname'] }]
        }, 
        { 
          model: sq.UserAddress, 
          as: 'address'
        }, 
        {
          model: sq.UserOrderItems,
          as: 'items', 
          include: [
            {
              model: sq.Products, as: 'product', attributes: ['name'], 
              include: [ 
                {
                  model: sq.ProductVariants, 
                  as: 'variants', 
                  attributes: ['id', 'name'], 
                  required: false,
                }
              ]
            },
          ]
        },
        {
          model: sq.Payments, 
          as: 'payment',
          include: [{ model: sq.PaymentMethods, as: 'method', attributes: ['name']}]
        }
      ],
      order: [['created_at', 'DESC']],
      ...paginationOptions(pageNum, limitNum, paginate)
    }
    const { count, rows } = await
      sq.UserOrders.findAndCountAll(queryOptions)

    const results = rows.map(order => { 
      const o = order.toJSON() 
      return { 
        id: o.id, 
        user: { 
          id: o.user?.id, 
          email: o.user?.email, 
          fullname: o.user?.profile?.fullname 
        }, 
        user_id: o.user_id,
        total_price: o.total_price, 
        status: o.status, 
        created_at: o.createdAt, 
        updated_at: o.updatedAt, 
        address: o.address, 
        items: o.items?.map(item => ({ 
          id: item.id, 
          product_id: item.product_id, 
          product_name: item.product?.name, 
          quantity: item.quantity, 
          price: item.price, 
          variant: item.variant, 
          variant_id: item.product?.variants?.find(v => v.name === item.variant)?.id ?? null
        })), 
        payment: o.payment ? { 
          id: o.payment.id, 
          method: o.payment.method?.name, 
          va_number: o.payment.va_number, 
          amount: o.payment.amount,
          admin_fee: o.payment.admin_fee, 
          total_amount: o.payment.total_amount, 
          status: o.payment.status, 
          expired_at: o.payment.expired_at, 
          paid_at: o.payment.paid_at
        }: null 
      }
    })

    const pagination = paginationMeta(count, pageNum, limitNum, paginate)

    sendSuccess(res, 200, { 
      ...(paginate && { "data": pagination }),
     results
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function getOne(req, res) { 
  const { id } = req.params
  const { userId, role } = req.user
  const user_id = parseInt(userId)
  try { 
    // const order = role === 'ADMIN'
    //   ? await ordersModel.findOne(id)
    //   : await ordersModel.findOne(id, user_id)
    // if (!order) { 
    //   return res.status(404).json({ 
    //     "success": false, 
    //     "message": "Order not found"
    //   })
    // }
    // 
    const where = role === 'ADMIN' ? { id } : { id, user_id }
    const order = await sq.UserOrders.findOne({ 
      where,
      include: [
        {
          model: sq.User,
          as: 'user',
          attributes: ['id', 'email'],
          include: [{ model: sq.UserProfile, as: 'profile', attributes: ['fullname'] }]
        },
        {
          model: sq.UserAddress,
          as: 'address'
        },
        {
          model: sq.UserOrderItems,
          as: 'items',
          include: [{ model: sq.Products, as: 'product', attributes: ['name'] }]
        },
        {
          model: sq.Payments,
          as: 'payment',
          include: [{ model: sq.PaymentMethods, as: 'method', attributes: ['name'] }]
        }
      ]
    })
    if (!order) { 
      return res.status(404).json({ 
        "success": false, 
        "message": "Order not found"
      })
    }
    const o = order.toJSON()
    const result = {
      id: o.id,
      user: {
        id: o.user?.id,
        email: o.user?.email,
        fullname: o.user?.profile?.fullname
      },
      user_id: o.user_id,
      total_price: o.total_price,
      status: o.status,
      created_at: o.createdAt,
      updated_at: o.updatedAt,
      address: o.address,
      items: o.items?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product?.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant
      })),
      payment: o.payment ? {
        id: o.payment.id,
        method: o.payment.method?.name,
        va_number: o.payment.va_number,
        amount: o.payment.amount,
        admin_fee: o.payment.admin_fee,
        total_amount: o.payment.total_amount,
        status: o.payment.status,
        expired_at: o.payment.expired_at,
        paid_at: o.payment.paid_at
      } : null
    }
    res.status(200).json({ 
      "success": true, 
      "message": "Success get order detail",
      "results": result
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}