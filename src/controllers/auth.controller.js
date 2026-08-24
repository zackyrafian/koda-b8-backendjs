import argon2, { hash } from "argon2"
import libJWT from "../libs/jwt.js";
import sq from "../models/index.js"
import regex from "../libs/regex.js";

export async function register(req, res) { 
  const { fullname, email, password } = req.body; 
  const tx = await sq.sequelize.transaction(); 
  try { 
    if (!regex.email.test(email)) { 
      await tx.rollback()
      return res.status(400).json({
        success: false,
        message: 'failed format email'
      })
    }

    const existing = await sq.User.findOne({ 
      where: { email },
      transaction: tx
    })
    
    if (existing) { 
      await tx.rollback()
      return res.status(409).json({ 
        "success": false, 
        "message": "Email already use."
      })
    }
    const hashPassword = await argon2.hash(password)
    const user = await sq.User.create({ 
      email, password: hashPassword
    }, { transaction: tx })

    await sq.UserProfile.create({ 
      user_id: user.id, 
      fullname,
    }, { transaction: tx })
    await tx.commit();
    return res.status(201).json({ 
      "success": true, 
      "message": `User Register ${fullname}`
    })
  } catch (error) { 
    await tx.rollback();
    res.status(500).json({ 
      "success": false, 
      "message": error.message,
    })
  }
}

export async function login(req, res) { 
  try { 
    const { email, password } = req.body; 
    if (!email || !password) {
       return res.status(400).json({ 
        "success": false, 
        "message": "Required email & password"
      })
    }

    const user = await sq.User.findOne({
      where: { email }
    })

    if (!user) { 
      return res.status(400).json({ 
        "success": false, 
        "message": "We don't have your email."
      })
    }
    
    const valid = await argon2.verify(user.password, password)
    if (!valid) { 
      return res.status(401).json({
        "success": false, 
        "message": "Email or password wrong."
      })
    }

    const token = libJWT.sign({ 
      userId: user.id,
        role: user.role
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