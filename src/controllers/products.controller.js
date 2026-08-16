import * as productsModels from "../models/products.model.js"
import qs from "qs"
import sq, { Sequelize } from "../models/index.js"

export async function getAll(req, res) { 
  const { search, page, limit, sort } = qs.parse(req.query)
  const pageNum = page !== undefined ? (parseInt(page) || 1) : null
  const limitNum = limit !== undefined ? (parseInt(limit) || 10) : null
  const paginate = pageNum !== null || limitNum !== null
  try { 
    // const { rows, total, totalPages, nextPage, prevPage } = await productsModels.findAll(search, pageNum, limitNum)
    // 
    // 
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
      ...(paginate && { 
        limit: limitNum, 
        offset: (pageNum - 1) * limitNum 
      })
    }

    const products = await sq.Products.findAll(queryOptions);

    const total = await sq.Products.count({ 
      where, 
      include: [
        { model: sq.ProductBrands, as: 'brand', where: brandWhere },
        { model: sq.ProductCategories, as: 'category', where: categoryWhere},
      ]
    })

    console.log(products)

    const totalPages = limitNum ? Math.ceil(total / limitNum) : 1
    const nextPage = pageNum && pageNum < totalPages ? pageNum + 1 : null
    const prevPage = pageNum && pageNum > 1 ? pageNum - 1 : null
    const response = products.map(product => ({ 
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

    console.log(response)
    res.status(200).json({ 
      "success": true, 
      "message": "Success get all products",
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
      "results": response
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

    // DEFUALT RESPONSE 
    // "success": true,
    //   "result": {
    //     "id": "1",
    //     "name": "Alex",
    //     "price": "100000",
    //     "discount": 0,
    //     "stock": 10,
    //     "sold_out": "156",
    //     "description": "test",
    //     "created_at": "2026-08-12T05:46:37.899Z",
    //     "updated_at": "2026-08-14T22:21:28.778Z",
    //     "brand_id": "1",
    //     "category_id": "1",
    //     "brand": "SoundWare",
    //     "category": "Audio",
    //     "images": [
    //       "/images/1786656823459-232293815.webp"
    //     ],
    //     "variant": [
    //       "Blue",
    //       "Red"
    //     ]
    // const product = await productsModels.findOne("id", id)
    // 
    console.log(Object.keys(sq))
    const product = await sq.Products.findByPk(id, { 
      include: [
        { model: sq.ProductBrands, as: 'brand' },
        { model: sq.ProductCategories, as: 'category' }, 
        { model: sq.ProductImages, as: 'images' }, 
        { model: sq.ProductVariants, as: 'variants' }
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
  try {
    const product = await productsModels.remove(id)
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
  try { 
    const product = await productsModels.create(req.body)
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

  console.log(id);
  console.log(req.file)
  try {
    const product = await productsModels.findOne("id", id)
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

    const urls = req.files.map(file => `/images/${file.filename}`)
    const images = await productsModels.createImages(id, urls)

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

  try { 
    const product = await productsModels.findOne("id", id)

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

    const deleted = await productsModels.removeImages(id, imagesIds)

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
  const { id } = req.params;
  console.log(req.body)
  try { 
    const existing = productsModels.findOne("id", id);

    if (!existing) { 
      return res.status(404).json({
        success: false, 
        message: "Product Not found"
      })
    }

    const product = await productsModels.update(id, req.body); 
    res.status(200).json({
      success: false, 
      message: "success updated product.",
      result: product
    })
  } catch (error) { 
    res.status(500).json({
      success: false, 
      message: error.message
    })
  }
}