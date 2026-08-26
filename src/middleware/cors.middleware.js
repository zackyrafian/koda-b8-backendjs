/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {function(){}} next 
 */
function corsMiddleware(req, res, next) { 
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") { 
    res.status(204).end()
    return;
  }
  next(); 
}

export default corsMiddleware;