/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {*} next
 */
function isAdmin(req, res, next) {
  console.log(req.user?.role)
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      "success": false,
      "message": "Access denied. Admin only."
    })
  }
  next()
}

export default isAdmin;
