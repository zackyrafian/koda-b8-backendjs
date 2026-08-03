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
