import sq from "../models/index.js"
import { sendError, sendNotFound, sendSuccess } from "../utils/response.js";

export async function getAll(req, res) {
  try { 
    const brands = await sq.ProductBrands.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt']}
    }); 
    return sendSuccess(res, 202, {
      results: brands,
    })
  } catch (error) { 
    return sendError(res, 500, "Internal Server Error")
  }
}

export async function getById(req, res) { 
  const { id } = req.params
  try { 
    const brand = await sq.ProductBrands.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    res.status(200).json({
      "success": true, 
      "results": brand,
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
    const brand = await sq.ProductBrands.create({ name })
    res.status(201).json({ 
      "success": true, 
      "messsage": `Successfully added ${brand.name}`,
      "result": {
        id: brand.id, 
        name: brand.name,
        created_at: brand.createdAt
      }
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
  try { 
    const brand = await sq.ProductBrands.destroy({ 
      where: { id }
    })

    if (!brand) { 
      sendNotFound(res, `Brand ID: ${id} not found.`)
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
    const brand = await sq.ProductBrands.update({ name },{ 
      where: { id }
    })
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