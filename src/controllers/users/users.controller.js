import sq from "../../models/index.js"

export async function getUserInfo(req, res) {
  const user_id = req.user.userId;

  try {
    const user = await sq.User.findByPk(user_id, {
      attributes: ["email", "role"]
    })

    if (!user) {
      return res.status(404).json({
        "success": false,
        "message": "User not found"
      })
    }

    res.status(200).json({
      "success": true,
      "message": "Success get user",
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
