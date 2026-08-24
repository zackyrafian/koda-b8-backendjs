export const sendSuccess = (res, statusCode = 200, data = {}, ) =>
  res.status(statusCode).json({ success: true, ...data })

export const sendError = (res, statusCode = 500, message) =>
  res.status(statusCode).json({ success: false, message })

export const sendNotFound = (res, message = "Resource not found") =>
  res.status(404).json({ success: false, message })

export const sendBadRequest = (res, message) =>
  res.status(400).json({ success: false, message })

export const sendForbidden = (res, message = "Access denied.") =>
  res.status(403).json({ success: false, message })
