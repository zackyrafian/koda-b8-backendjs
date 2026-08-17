import sq from "../../models/index.js"

export async function getAll(req, res) { 
  const user_id = parseInt(req.user.userId)
  try { 
    // const carts = await userCartModel.findAll(user_id)
    const carts = await sq.UserCart.findAll({
      where: { user_id }, 
      include: [{ model: sq.Products, as: 'products' }],
      raw: true,
      nest: true
    })
    
    const response = carts.map(cart => ({
      id: cart.id,
      user_id: cart.user_id,
      product_id: cart.product_id,
      quantity: cart.quantity,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      name: cart.products?.name,
      price: cart.products?.price,
      images: cart.products?.images || [],
      variant: cart.variant || null
    }))
    
    // DEFAULT RESPONSE 
    // {
    //   "id": "42",
    //   "user_id": "1",
    //   "product_id": "12",
    //   "quantity": 92,
    //   "created_at": "2026-08-15T23:39:14.954Z",
    //   "updated_at": "2026-08-15T23:39:14.954Z",
    //   "name": "Microphone Condenser USB",
    //   "price": "850000",
    //   "images": [],
    //   "variant": null
    // },
    
    res.status(200).json({ 
      "success": true, 
      "results": response
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function create(req, res) { 
  const user_id = parseInt(req.user.userId)
  console.log(user_id)
  const { product_id, quantity, variant } = req.body;
  try { 
    if (!product_id || !quantity || quantity < 1) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "product_id and quantity are required and quantity must be >= 1"
      }) 
    }
    // await userCartModel.create(user_id, product_id, quantity, variant)
    // res.status(201).json({ 
    //   "success": true, 
    //   "message": "Product successfully added to cart."
    // })
    await sq.UserCart.create({ 
      user_id, 
      product_id, 
      quantity, 
      variant,
    })

    res.status(201).json({ 
      success: true, 
      message: "Product successfully added to cart"
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function updateQuantity(req, res) {
  const user_id = parseInt(req.user.userId)
  const cart_id = parseInt(req.params.id)
  const { quantity } = req.body;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        "success": false,
        "message": "quantity is required and must be >= 1"
      })
    }
    // const updated = await userCartModel.updateQuantity(cart_id, user_id, quantity)
    // if (!updated) {
    //   return res.status(404).json({
    //     "success": false,
    //     "message": "Cart item not found."
    //   })
    // }
    // 
    const [updated] = await sq.UserCart.update({
      quantity
    }, {
      where: { 
        id: cart_id, 
        user_id
      }
    })

    if (updated == 0) { 
      return res.status(404).json({ 
        success: false,
        message: "Cart item not found"
      })
    }

    const cart = await sq.UserCart.findOne({ 
      where: { id: cart_id, user_id }
    })
    console.log(cart)
    res.status(200).json({
      "success": true,
      "message": "Cart quantity updated.",
      "result": cart
    })
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message
    })
  }
}

export async function remove(req, res) {
  const user_id = parseInt(req.user.userId)
  const cart_id = parseInt(req.params.id)
  try {
    // const deleted = await userCartModel.deleteById([cart_id], user_id)
    const deleted = await sq.UserCart.destroy({ 
      where: { id: cart_id, user_id }
    })
    if (deleted === 0) {
      return res.status(404).json({
        "success": false,
        "message": "Cart item not found."
      })
    }
    res.status(200).json({
      "success": true,
      "message": "Cart item removed."
    })
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message
    })
  }
}
