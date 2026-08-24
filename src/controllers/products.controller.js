import qs from "qs"
import sq, { Sequelize } from "../models/index.js"
import { paginationMeta, paginationOptions, parsePagination } from "../utils/pagination.js"
import { sendSuccess } from "../utils/response.js"

export async function getAll(req, res) { 
  const { search, sort } = qs.parse(req.query)
  const { pageNum, limitNum, paginate } = parsePagination(req.query)
  try { 
    const where = {} 
    const brandWhere = {}
    const categoryWhere = {} 

    if (search?.name) { 
      where.name = { [sq.Sequelize.Op.iLike]: `%${search.name}%`}
    }

    if (search?.brand) { 
      brandWhere.name = { [sq.Sequelize.Op.iLike]: `%${search.brand}%`}
    }

    if (search?.category) {
      categoryWhere.name = { [sq.Sequelize.Op.iLike]: `%${search.category}%`}
    }

    const allowedSortField = ['id', 'name', 'price', 'stock', 'sold_out', 'created_at']
    const allowedSortDir = ['ASC', 'DESC']

    const order = [] 
    if (sort) { 
      Object.entries(sort).forEach(([field, dir]) => {
        const direction = dir?.toUpperCase() 
        if (allowedSortField.includes(field) && allowedSortDir.includes(direction)) { 
          order.push([field, direction])
        }
      })
    }

    if (order.length === 0) { 
      order.push(['id', 'ASC'])
    }
    
    const queryOptions = { 
      where, 
      include: [ 
        { model: sq.ProductBrands, as: 'brand', where: brandWhere },
        { model: sq.ProductCategories, as: 'category', where: categoryWhere },
        { model: sq.ProductImages, as: 'images' },
        { model: sq.ProductVariants, as: 'variants'},
      ], 
      order,
      ...paginationOptions(pageNum, limitNum, paginate)
    }
    const { count, rows } = await sq.Products.findAndCountAll(queryOptions);
    const pagination = paginationMeta(count, pageNum, limitNum, paginate)
    const results = rows.map(product => ({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      discount: product.discount, 
      stock: product.stock, 
      sold_out: product.sold_out, 
      description: product.description, 
      create_at: product.createdAt, 
      updated_at: product.updatedAt,
      brand_id: product.brand_id, 
      category_id: product.category_id,
      brand: product.brand?.name || null, 
      category: product.category?.name || null, 
      images: product.images?.map(img => img.url) || [], 
      variant: product.variants?.map(v => v.name) || [],
    }))

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

export async function getById(req, res) { 
  const { id } = req.params;
  try { 
    const product = await sq.Products.findByPk(id, { 
      include: [
        { model: sq.ProductBrands, as: 'brand' },
        { model: sq.ProductCategories, as: 'category' }, 
        { model: sq.ProductImages, as: 'images' }, 
        { model: sq.ProductVariants, as: 'variants' },
        {
          model: sq.ProductReviews, as: 'reviews',
          include: {
            model: sq.User, as: 'user',
            attributes: ['email'],
            include: { 
              model: sq.UserProfile, as: 'profile',
              attributes: ['fullname']
            }
          }
        },
      ]
    })
    if (!product) { 
      res.status(404).json({
        "success": false, 
        "message": `Product ${id} not found.`
      })
      return
    }

    const response = { 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      discount: product.discount, 
      stock: product.stock, 
      sold_out: product.sold_out, 
      description: product.description, 
      create_at: product.createdAt, 
      updated_at: product.updatedAt,
      brand_id: product.brand_id, 
      category_id: product.category_id,
      brand: product.brand?.name || null, 
      category: product.category?.name || null, 
      images: product.images?.map(img => img.url) || [], 
      variant: product.variants?.map(v => v.name) || [],
      reviews: product.reviews?.map(r => ({
        id: r.id ,
        rating: r.rating,
        comment: r.comment, 
        created_at: r.created_at,
        fullname: r.user.profile?.fullname || null, 
        email: r.user?.email || null
      }))
    }
    res.status(200).json({ 
      "success": true, 
      "result": response
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function remove(req, res) {
  const { id } = req.params
  const { role } = req.user
  try {
    // const product = await productsModels.remove(id)
    if (role !== 'ADMIN') { 
      return res.status(403).json({
        success: false, 
        message: 'ADMIN Permission'
      })
    }
    
    const product = await sq.Products.destroy({ 
      where: { id }
    })
    if (!product) {
      return res.status(404).json({
        "success": false,
        "message": `Product ${id} not found.`
      })
    }
    res.status(200).json({
      "success": true,
      "message": `Product ${product.name} deleted.`
    })
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message
    })
  }
}

export async function create(req, res) { 
  const { role } = req.user;
  const { name, price, discount, stock, description, brand_id, category_id, variant } = req.body; 
  const variants = [...new Set( 
    (typeof variant === "string" ? variant.split(",") : []).map(v => v.trim()).filter(Boolean)
  )]
  try { 
    // const product = await productsModels.create(req.body)
    // 
    if (role !== 'ADMIN') { 
      return res.status(403).json({
        success: false, 
        message: 'ADMIN Permission'
      })
    }
    const product = await sq.Products.create({ 
      name, 
      price, 
      discount, 
      stock, 
      description, 
      brand_id, 
      category_id, 
      variants: variants.map(name => ({ name })),
    }, { 
      include: [
        { model: sq.ProductVariants, as: 'variants' }, 
      ]
    })
    res.status(201).json({ 
      "success": true, 
      "message": "Success created product.", 
      "result": product
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  } 
}

export async function uploadImages(req, res) {
  const { id } = req.params

  try {
    // const product = await productsModels.findOne("id", id)
    const product = await sq.Products.findByPk(id) 
    if (!product) {
      return res.status(404).json({
        "success": false,
        "message": `Product ${id} not found.`
      })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        "success": false,
        "message": "No images uploaded."
      })
    }

    const images = await sq.ProductImages.bulkCreate(
      req.files.map(file => ({ 
        product_id: id, 
        url: `/images/${file.filename}`
      }))
    )
    // const urls = req.files.map(file => `/images/${file.filename}`)
    // const images = await productsModels.createImages(id, urls)

    res.status(201).json({
      "success": true,
      "message": `${images.length} image(s) uploaded for product ${id}.`,
      "result": images
    })
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message
    })
  }
}

export async function removeImages(req, res) {
  const { id } = req.params; 
  const { imagesIds } = req.body; 
  const { role } = req.user; 
  try { 

    if (!role !== 'ADMIN') { 
      return res.status(403).json({ 
        success: false,
        message: "ADMIN Permission"
      })
    }
    // const product = await productsModels.findOne("id", id)
    const product = await sq.Products.findByPk(id)
    if (!product) { 
      return res.status(404).json({ 
        success: false, 
        message: `Product ${id} not found.`
      })
    }

    if (!imagesIds || !Array.isArray(imagesIds) || imagesIds.length === 0) { 
      return res.status(400).json({ 
        success: false, 
        message: "No image IDs provided."
      })
    }

    // const deleted = await productsModels.removeImages(id, imagesIds)
    const deleted = await sq.Products.destory({
      where: { id: imagesIds, product_id: id }
    })
    res.status(200).json({ 
      success: false, 
      message: `${deleted.length} image(s) deleted from product ${id}.`,
      result: deleted
    })
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: error.message
    })
  }
}

export async function update(req, res) { 
  const { id } = req.params
  const { name, price, discount, stock, description, brand_id, category_id, variant } = req.body
  const { role } = req.user

  try { 

    if (role !== "ADMIN") { 
      return res.status(403).json({ 
        success: false, 
        message: "ADMIN Permission"
      })
    }
    const product = await sq.Products.findByPk(id, {
      include: [{ model: sq.ProductVariants, as: 'variants' }]
    })

    if (!product) { 
      return res.status(404).json({
        success: false, 
        message: "Product not found"
      })
    }

    await product.update({
      name, price, discount, stock, description, brand_id, category_id
    })

    if (variant !== undefined) {
      const variants = [...new Set(
        (typeof variant === "string" ? variant.split(",") : [])
          .map(v => v.trim())
          .filter(Boolean)
      )]

      await sq.ProductVariants.destroy({ where: { product_id: id } })

      if (variants.length > 0) {
        await sq.ProductVariants.bulkCreate(
          variants.map(name => ({ product_id: id, name }))
        )
      }
    }

    const updated = await sq.Products.findByPk(id, {
      include: [
        { model: sq.ProductVariants, as: 'variants' },
        { model: sq.ProductImages, as: 'images' }
      ]
    })

    res.status(200).json({
      success: true, 
      message: "Success updated product.",
      result: updated
    })
  } catch (error) { 
    res.status(500).json({
      success: false, 
      message: error.message
    })
  }
}