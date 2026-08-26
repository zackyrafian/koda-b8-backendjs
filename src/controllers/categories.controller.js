import sq from "../models/index.js"

export async function getAll(req, res) { 
  try {
    const categories = await sq.ProductCategories.findAll()
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
    // const category = await categoriesModels.findOne("id", id)
    // 
    const category = await sq.ProductCategories.findOne({
      where: { id }
    })

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
    await sq.ProductCategories.create({ name })
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
    const category = await sq.ProductCategories.destroy({ 
      where: { id }
    })
    if (!category) { 
      res.status(404).json({ 
        "success": false, 
        "message": `Category id ${id} not found.`
      })
      return
    }

    res.status(200).json({ 
      "success": true, 
      "message": `Success deleted category ${id}`
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
    const category = await sq.ProductCategories.update({ name }, {
      where: { id }
    })
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