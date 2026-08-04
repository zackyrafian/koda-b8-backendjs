import * as userModel from "../../models/users/profiles.model.js"

export async function getUserProfile(req, res) { 
  const user_id = parseInt(req.user.userId)
  const user = await userModel.findProfile(user_id)
  try { 
    if (!user) { 
      res.status(404).json({ 
        "success": false, 
        "message": `404 -> ${user_id}`
      })
      return;
    }
    res.status(200).json({ 
      "status": true, 
      "message": "Successfully get users profile",
      "result": user
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

