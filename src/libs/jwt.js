import jwt from "jsonwebtoken"

const JWT_SECRET = "ALEX" 


function sign(payload) { 
  return jwt.sign(payload, JWT_SECRET)
}

function verify(token) { 
  return jwt.verify(token, JWT_SECRET)
}

const libJWT = { 
  sign, 
  verify
}

export default libJWT;