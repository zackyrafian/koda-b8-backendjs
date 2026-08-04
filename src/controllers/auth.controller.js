import argon2, { hash } from "argon2"
import libJWT from "../libs/jwt.js";
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

export async function loign(req, res) { 
  try { 
    const { email, password } = req.body; 
    if (!email || !password) {
       return res.status(400).json({ 
        "success": false, 
        "message": "Required email & password"
      })
    }
    
    const user = await userModel.findOne("email", email)
    if (!user) { 
      res.status(400).json({ 
        "success": false, 
        "message": "We don't have your email."
      })
      return
    }

    const valid = await argon2.verify(user.password, password)
    if (!valid) { 
      return res.status(401).json({
        "success": false, 
        "message": "Email or password wrong."
      })
    }

    const token = libJWT.sign({ 
      userId: user.id
    })
    res.status(200).json({ 
      "success": true,
      "data": { token }
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}