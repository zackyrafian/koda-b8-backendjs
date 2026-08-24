import argon2 from "argon2"
import libJWT from "../libs/jwt.js";
import sq, { Sequelize } from "../models/index.js"
import { requireFields } from "../utils/validation.js";
import { sendBadRequest, sendError, sendSuccess } from "../utils/response.js";

export async function register(req, res) { 
  const { fullname, email, password } = req.body; 
  const tx = await sq.sequelize.transaction(); 
  try { 
    const missing = requireFields(req.body, ["fullname", "email", "password"]); 
    if (missing) return sendBadRequest(res, `Missing fields: ${missing.join(", ")}`)
    
    const user = await sq.User.create({ 
      email, password,
    }, { transaction: tx })

    await sq.UserProfile.create({ 
      user_id: user.id, 
      fullname,
    }, { transaction: tx })
    await tx.commit();
    return sendSuccess(res, 201, { message: `User Register ${fullname}` })
  } catch (error) { 
    await tx.rollback();
    if (error instanceof Sequelize.UniqueConstraintError) { 
      return sendError(res, 409, "Email already exsists.")
    }
    if (error instanceof Sequelize.ValidationError) { 
      return sendBadRequest(res, error.errors[0].message)
    }
    return sendError(res, 500, error.message)
  }
}

export async function login(req, res) {
  const { email, password } = req.body; 
  try { 
    const missing = requireFields(req.body, ["email", "password"]); 
    if (missing) return sendBadRequest(res, `Missing field: ${missing.join(", ")}`)

    const user = await sq.User.findOne({ where: { email } })
    if (!user) return sendError(res, 401, "Email or password wrong.")
    
    const valid = await argon2.verify(user.password, password)
    if (!valid) return sendError(res, 401, "Email or password wrong.")

    const token = libJWT.sign({ 
      userId: user.id,
        role: user.role
    })
    return sendSuccess(res, 200, {
      data: { token }
    })
  } catch (error) { 
    if (error instanceof Sequelize.ValidationError) { 
      return sendBadRequest(res, error.errors[0].message)
    } 
    return sendError(res, 500, "Invalid server error")
  }
}