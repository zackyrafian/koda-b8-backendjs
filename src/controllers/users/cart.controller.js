import * as userCartModel from "../../models/users/cart.model.js"

export async function getAll(req, res) { 
  const user_id = parseInt(req.user.userId)
  try { 
    const carts = await userCartModel.findAll(user_id)
    if (!carts) { 
      res.status(404).json({ 
        "success": false, 
        "message": `User id ${user_id} not found.`
      })
      return
    }
    res.status(200).json({ 
      "success": true, 
      "results": carts
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": true, 
      "message": error.message
    })
  }
}

export async function create(req, res) { 
  const user_id = parseInt(req.user.userId)
  const { product_id, quantity } = req.body;
  try { 
    if (!user_id) { 
      return res.status(400).json({ 
        "success": false, 
      })
    } 
    if (!product_id && !quantity || quantity < 1) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "Format Failed"
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