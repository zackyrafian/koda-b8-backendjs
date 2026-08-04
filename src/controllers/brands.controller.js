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

export async function create(req, res) { 
  const { name } = req.body; 
  try { 
    if (!name) { 
      return req.status(400).json({
        "success": false, 
        "message": "Required name"
      })
    }
    const brand = await brandsModels.create(name) 
    res.status(201).json({ 
      "success": true, 
      "messsage": `Successfully added ${brand.name}`,
      "result": brand
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function remove(req, res) { 
  const { id } = req.params; 
  const brand = brandsModels.remove(id)
  console.log(brandRouter)
  
  try { 
    if (!brand) { 
      res.status(404).json({ 
        "success": false, 
        "message" : `Brand with ${id} not found.`
      })
    }

    res.status(200).json({ 
      "success": true, 
      "message": `Brand ${brand.name} deleted.`
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function edit(req, res) { 
  const { id } = req.params; 
  try { 
    const { name } = req.body;
    if (!name) { 
      res.status(400).json({ 
        "success": false, 
        "message": "Required Name"
      })
      return
    }
    const brand = await brandsModels.edit(id, name)
    if (!brand) { 
      res.status(404).json({ 
        "success": false, 
        "message": `Brand ${id} not found.`
      })
      return
    }

    res.status(200).json({ 
      "success": true, 
      "message": `Brands ${id}`
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}