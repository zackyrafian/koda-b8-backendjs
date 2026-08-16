import * as ordersModel from "../../models/users/orders.model.js"
import * as cartModel from "../../models/users/cart.model.js"
import * as addressModel from "../../models/users/address.model.js"
import * as paymentModel from "../../models/payment.model.js"
import generateVA  from "../../utils/va.js"
import * as usersModel from "../../models/user.model.js"
import sq from '../../models/index.js'

export async function create(req, res) { 
  const io = req.app.get("io")
  const user_id = parseInt(req.user.userId)
  const { cart_id, address_id, payment_method_id } = req.body
  try { 
    // const user = await usersModel.findOne("id", user_id)
    // 
    const user = await sq.User.findByPk(user_id, { 
      include: [{ model: sq.UserProfile, as: 'profile' }]
    })
    if (!user) { 
      return res.status(404).json({ 
        success: false, 
        message: "user not found."
      })
    }
    
    if (!cart_id || cart_id.length === 0) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "cart_id is required"
      })
    }

    if (!address_id) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "address_id is required"
      })
    }

    const [address, paymentMethod] = await Promise.all([
      // addressModel.findOne(user_id, 'id', address_id),
      sq.UserAddress.findOne({ 
        where: {id: address_id, user_id}
      }),
      paymentModel.findMethodById(payment_method_id)
    ])
    if (!address) { 
      return res.status(404).json({ 
        "success": false, 
        "message": "Address not found"
      })
    }
    // const cart_items = await cartModel.findById(cart_id, user_id)
    const cart_items = await sq.UserCart.findAll({ 
      where: { user_id, id: cart_id }, 
      include: [{ model: sq.Products, as: 'products' }],
    })

    // console.log(JSON.stringify(cart_items, null, 2))
    const items = cart_items.map(item => ({ 
      id: item.id, 
      user_id: item.user_id, 
      product_id: item.product_id, 
      variant: item.variant, 
      quantity: item.quantity, 
      price: item.products?.price
    }))
    
    
    if (cart_items.length === 0) { 
      return res.status(404).json({ 
        "success": false, 
        "message": "No cart items found"
      })
    }

    const total_price = cart_items.reduce((sum, item) => {
     return sum + (Number(item.products.price) * item.quantity) 
    }, 0)
    // const order = await ordersModel.create(user_id, address_id, cart_items)
    const order = await sq.UserOrders.create({ 
      user_id, 
      address_id, 
      total_price,
    })
    await sq.UserOrderItems.bulkCreate( 
      items.map(item => ({ 
        order_id: order.id, 
        product_id: item.product_id, 
        variant: item.variant, 
        quantity: item.quantity, 
        price: item.price
      }))
    )
    
    console.log(JSON.stringify(order, null, 2))

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
    })

    const orderData = {
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
    
    // await cartModel.deleteById(cart_id, user_id)
    
    await sq.UserCart.destroy({
      where: { id: cart_id, user_id }
    })
    io.emit("new_orders", { 
      success: true, 
      results: orderData
    })
    res.status(201).json({ 
      "success": true, 
      "message": "Order created successfully",
      "results": orderData,
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}


export async function getAll(req, res) { 
  const { userId, role } = req.user
  const user_id = parseInt(userId)
  const { page, limit } = req.query
  const pageNum = page !== undefined ? (parseInt(page) || 1) : null
  const limitNum = limit !== undefined ? (parseInt(limit) || 10) : null
  const paginate = pageNum !== null || limitNum !== null
  try { 
    const result = role === 'ADMIN'
      ? await ordersModel.findAll(undefined, pageNum, limitNum)
      : await ordersModel.findAll(user_id, pageNum, limitNum)
    const { rows, total, totalPages, nextPage, prevPage } = result


    res.status(200).json({ 
      "success": true,
      ...(paginate && {
        "data": {
          "total": total,
          "page": pageNum,
          "limit": limitNum,
          "totalPages": totalPages,
          "nextPage": nextPage,
          "prevPage": prevPage
        }
      }),
      "results": rows
    })
    console.log(rows)
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
    const order = role === 'ADMIN'
      ? await ordersModel.findOne(id)
      : await ordersModel.findOne(id, user_id)
    if (!order) { 
      return res.status(404).json({ 
        "success": false, 
        "message": "Order not found"
      })
    }
    res.status(200).json({ 
      "success": true, 
      "message": "Success get order detail",
      "results": order
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}