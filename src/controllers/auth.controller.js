import argon2, { hash }  from "argon2"
import * as userModel from "../models/user.model.js"

export async function register(req, res) { 
  try { 
    console.log(req.body)
    const { fullname, email, password } = req.body; 
    const existing = await userModel.findOne("email", email)

    if (email.indexOf('@') === -1) { 
      res.status(400).json({ 
        "success": false, 
        "message": "format email.."
      })
    }

    if (existing) { 
      res.status(409).json({ 
        "success": false, 
        "message": "Email already use."
      })
      return 
    }
    const hashPassword = await argon2.hash(password)
    const data = await userModel.create({fullname, email, password: hashPassword})
    console.log(data);
    res.status(201).json({ 
      "success": true, 
      "message": `User Register ${fullname}`
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message,
    })
  }
}
