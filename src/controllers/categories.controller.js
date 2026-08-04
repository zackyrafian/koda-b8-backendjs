import * as categoriesModels from "../models/categories.model.js"

export async function getAll(req, res) { 
  try {
    const categories = await categoriesModels.findAll()
    res.status(200).json({ 
      "success": true, 
      "results": categories
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}