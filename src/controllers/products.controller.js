import * as productsModels from "../models/products.model.js"
import qs from "qs"

export async function getAll(req, res) { 
  const { search } = qs.parse(req.query)
  try { 
    const products = await productsModels.findAll(search)
    res.status(200).json({ 
      "success": true, 
      "message": "Success get all products",
      "results": products
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