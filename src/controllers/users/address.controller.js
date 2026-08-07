import * as userAddressModel from "../../models/users/address.model.js"

export async function create(req, res) {
  const user_id = req.user.userId 
  const {
    recipient_name,
    phone_number,
    recipient_email,
    recipient_address_full,
    recipient_city,
    recipient_province,
    zip_code
  } = req.body;

  const request = { 
    recipient_name,
    phone_number,
    recipient_email,
    recipient_address_full,
    recipient_city,
    recipient_province,
    zip_code
  }
  try { 
    const address = await userAddressModel.create(user_id, request)
    console.log(address)
    res.status(200).json({ 
      "success": true, 
      "message": "Success added address.",
      "result": { 
        id: address.id
      }
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function getAll(req, res) { 
  const user_id = req.user.userId 
  try { 
    const address = await userAddressModel.findAll(user_id)
    if (!address) { 
      res.status(404).json({ 
        "success": false, 
        "message": "-> 404"
      })
      return
    } 
    res.status(200).json({ 
      "success": true, 
      "results": address
    })
  } catch (error) { 
    res.status(500).json({
      "success": false, 
      "message": error.message
    })
  }
}

export async function getById(req, res) { 
  const { id } = req.params
  const user_id = req.user.userId 
  if (!id || isNaN(id)) { 
    res.status(400).json({ 
      "success": false, 
      "message": "invalid id"
    })
    return
  }
  try { 
    const address = await userAddressModel.findOne(user_id, "id", id)
    if (!address) { 
      return res.status(404).json({ 
        "success": false,
        "message": "Address not found."
      })
    }
    res.status(200).json({ 
      "success": true,
      "result": address
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}