import multer from "multer"
import path from "path"
import fs from "fs"
import sharp from "sharp"

const uploadDir = "images"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.memoryStorage()


// const storage = multer.diskStorage({ 
//   destination: (req, file, callback) => { 
//     callback(null, uploadDir)
//   }, 
//   filename: (req, file, callback) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
//     const ext = path.extname(file.originalname)
//     callback(null, `${uniqueSuffix}${ext}`)
//   }
// })

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(
      new Error("Only image files (jpeg, png, webp, gif) are allowed"),
      false
    )
  }
}

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
})

async function processImage(file) { 
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const filename = `${uniqueSuffix}.webp`
  const outputPath = path.join(uploadDir, filename)

  await sharp(file.buffer)
    .rotate()
    .resize({ 
      width: 1200, 
      height: 1200, 
      fit: "inside", 
      withoutEnlargement: true, 
    })
    .webp({ 
      quality: 80
    })
    .toFile(outputPath)

  return filename
}

 function uploadMiddleware(fieldName) {
  return (req, res, next) => { 
    upload.single(fieldName)(req, res, async(error) => { 
      if (error) { 
        res.status(400).json({ 
          "success": false, 
          "message": error.message
        })
        return
      }

      if (!req.file) {
        return next();
      }

      try { 
        const filename = await processImage(req.file)
        req.file.filename = filename
        req.file.path = path.join(uploadDir, filename)
        req.file.mimetype = "image/webp"
        next()
      } catch (e) { 
        return res.status(500).json({ 
          success: false, 
          message: "Failed to process image",
        })
      }
    })
  }
}

function uploadMultipleMiddleware(fieldName, maxCount = 5) {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, async (error) => {
      if (error) {
        res.status(400).json({
          "success": false,
          "message": error.message
        })
        return
      }

      try {
        const processedFiles = await Promise.all(
          req.files.map(processImage)
        )

        req.files = processedFiles.map((filename) => ({
          filename, 
          path: path.join(uploadDir, filename), 
          mimetype: "image/webp",
        }))
        next()
      } catch (e) { 
        res.status(500).json({ 
          success: false, 
          message: "falied to process images",
        })
      }
    })
  }
}

export { uploadMultipleMiddleware, uploadMiddleware}
// export default uploadMiddleware