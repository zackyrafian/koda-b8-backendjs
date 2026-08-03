import * as brandsModels from "../models/brands.model.js"

export async function getAll(req, res) {
  try { 
    const brands = await brandsModels.findAll()
    res.status(200).json({ 
      "success": true, 
      "results": brands
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message,
    })
  }
}

export async function getById(req, res) { 
  const { id } = req.params
  try { 
    const brand = await brandsModels.findOne("id", id)
    if (!brand) { 
      res.status(400).json({ 
        "success": false, 
        "message": `Brand id ${id} not found.`
      })
      return 
    }
    res.status(200).json({
      "success": true, 
      "data": brand,
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}