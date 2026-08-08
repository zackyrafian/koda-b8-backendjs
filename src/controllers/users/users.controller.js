import * as userModel from "../../models/user.model.js"

export async function getUserInfo(req, res) { 
  const user_id = req.user.userId; 
  console.log(user_id)

  try {
    const user = await userModel.findOne("id", user_id)
    res.status(200).json({ 
      "success": true, 
      "message": "Success get user" ,
      "result": { 
        email: user.email, 
        role: user.role
      },
    })
  } catch (error) {
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}