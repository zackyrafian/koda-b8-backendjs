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
    return
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
    return
  }
}

export async function create(req, res) { 
  const { name } = req.body;
  try { 
    if (!name) { 
      res.status(400).json({ 
        "success": false, 
        "message": "Required name"
      })
      return
    }
    await categoriesModels.create(name)

    res.status(201).json({ 
      "success": true, 
      "message": `Category ${name} created.`
    })
  } catch (error) { 
    res.status(500).json({
      "success": false, 
      "message": error.message
    })
    return;
  }
}

export async function remove (req, res) { 
  const { id } = req.params; 
  try { 
    const category = categoriesModels.remove(id)
    if (!category) { 
      res.status(404).json({ 
        "success": false, 
        "message": ""
      })
      return
    }

    res.status(200).json({ 
      "success": true, 
      "message": ""
    })
  } catch (error) {
    res.status(500).json({ 
      "success": false, 
      "message" : error.message
    })
    return
  }
}

export async function update(req, res) { 
  const { id } = req.params; 
  const { name } = req.body; 
  try { 
    if (!name) { 
      res.status(400).json({ 
        "success": false, 
        "message": "Required name"
      })
      return;
    }
    const category = categoriesModels.update(id, name)
    if (!category) { 
      res.status(404).json({ 
        "success": false, 
        "message": `Category id ${id} not found.`
      })
      return;
    }
    res.status(200).json({ 
      "success": true, 
      "messsage": `Category ${id} update.`
    })
  } catch (error) {
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
    return;
  }
}