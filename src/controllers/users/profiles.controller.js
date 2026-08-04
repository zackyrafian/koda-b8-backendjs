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

export async function profileImage(req, res) { 
  const user_id = parseInt(req.user.userId)
  const file = req.file 
  try { 
    await userModel.updateProfile(user_id, { 
      picture_path: file.path,
    })

    res.status(200).json({ 
      "success": true, 
      "message": "Success added profile user profile.",
      "data": { 
        "filename": file.path
      }
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}