import * as userCartModel from "../../models/users/cart.model.js"

export async function getAll(req, res) { 
  const user_id = parseInt(req.user.userId)
  try { 
    const carts = await userCartModel.findAll(user_id)
    res.status(200).json({ 
      "success": true, 
      "results": carts
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
  const { product_id, quantity } = req.body;
  try { 
    if (!product_id || !quantity || quantity < 1) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "product_id and quantity are required and quantity must be >= 1"
      }) 
    }
    await userCartModel.create(user_id, product_id, quantity)
    res.status(201).json({ 
      "success": true, 
      "message": "Product successfully added to cart."
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
    const updated = await userCartModel.updateQuantity(cart_id, user_id, quantity)
    if (!updated) {
      return res.status(404).json({
        "success": false,
        "message": "Cart item not found."
      })
    }
    res.status(200).json({
      "success": true,
      "message": "Cart quantity updated.",
      "result": updated
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
    const deleted = await userCartModel.deleteById([cart_id], user_id)
    if (!deleted.length) {
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
