import libJWT from "../libs/jwt.js"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {*} next 
 */
function authMiddleware(req, res, next) { 
  const authHeader = req.header("Authorization")
  const prefix = "Bearer "

  if (!authHeader) { 
    return res.status(401).json({ 
      "sucesss": false, 
      "message": "401"
    })
  }

  if (authHeader.startsWith(prefix)) { 
    try { 
      const token = authHeader.slice(prefix.length)
      const data = libJWT.verify(token)
      req.user = {...data, userId: parseInt(data.userId)} 
      next()
    } catch (error) { 
      return res.status(401).json({ 
        "success": false, 
        "message": error.message
      })
    }
  } else { 
    return res.status(401).json({ 
      "success": false, 
    })
  }
}

export default authMiddleware;