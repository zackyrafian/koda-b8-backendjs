import sq from '../../models/index.js'

export async function getAll(req, res) { 
  const user_id = parseInt(req.user.userId)
  try { 
    const wishlists = await sq.UserWishlists.findAll({
      where: { user_id },
      include: [{ 
        model: sq.Products, 
        as: 'product',
        attributes: ['id', 'name', 'price']
      }],
      order: [['created_at', 'DESC']]
    })
    res.status(200).json({ 
      "success": true, 
      "results": wishlists
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
  const { product_id } = req.body;
  try { 
    if (!product_id) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "product_id is required"
      }) 
    }

    const product = await sq.Products.findByPk(product_id)
    if (!product) {
      return res.status(404).json({
        "success": false,
        "message": "Product not found"
      })
    }

    const existing = await sq.UserWishlists.findOne({
      where: { user_id, product_id }
    })
    if (existing) {
      return res.status(409).json({
        "success": false,
        "message": "Product already in wishlist"
      })
    }

    await sq.UserWishlists.create({ user_id, product_id })
    res.status(201).json({ 
      "success": true, 
      "message": "Product successfully added to wishlist."
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
  const { id } = req.params
  try {
    const wishlist = await sq.UserWishlists.findOne({
      where: { id, user_id }
    })
    if (!wishlist) {
      return res.status(404).json({
        "success": false,
        "message": "Wishlist item not found"
      })
    }
    await wishlist.destroy()
    res.status(200).json({
      "success": true,
      "message": "Product removed from wishlist."
    })
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message
    })
  }
}
