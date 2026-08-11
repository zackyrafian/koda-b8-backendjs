import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = "images"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({ 
  destination: (req, file, callback) => { 
    callback(null, uploadDir)
  }, 
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    callback(null, `${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error("Only image files (jpeg, png, webp, gif) are allowed"), false)
  }
}

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 2 * 1024 * 1024 },
  // fileFilter
})

function uploadMiddleware(fieldName) {
  return (req, res, next) => { 
    upload.single(fieldName)(req, res, (error) => { 
      if (error) { 
        res.status(400).json({ 
          "success": false, 
          "message": error.message
        })
        return
      }
      next()
    })
  }
}

function uploadMultipleMiddleware(fieldName, maxCount = 5) {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (error) => {
      if (error) {
        res.status(400).json({
          "success": false,
          "message": error.message
        })
        return
      }
      next()
    })
  }
}

export { uploadMultipleMiddleware, uploadMiddleware}
// export default uploadMiddleware