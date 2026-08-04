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

export async function getById(req, res) { 
  const { id } = req.params; 
  try { 
    const category = await categoriesModels.findOne("id", id)

    if (!category) { 
      res.status(404).json({
        "success": false, 
        "message": `Category ${id} not found.`
      })
      return
    }

    res.status(200).json({ 
      "success": true,
      "result": category
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}