import * as productsModels from "../models/products.model.js"
import qs from "qs"

export async function getAll(req, res) { 
  const { search, page, limit } = qs.parse(req.query)
  const pageNum = page !== undefined ? (parseInt(page) || 1) : null
  const limitNum = limit !== undefined ? (parseInt(limit) || 10) : null
  const paginate = pageNum !== null || limitNum !== null
  try { 
    const { rows, total, totalPages, nextPage, prevPage } = await productsModels.findAll(search, pageNum, limitNum)
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
      "results": rows
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
    const product = await productsModels.findOne("id", id)
    if (!product) { 
      res.status(404).json({
        "success": false, 
        "message": `Product ${id} not found.`
      })
      return
    }
    res.status(200).json({ 
      "success": true, 
      "result": product
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