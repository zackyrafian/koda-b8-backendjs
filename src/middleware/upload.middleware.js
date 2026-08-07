import multer from "multer"

const storage = multer.diskStorage({ 
  destination: (req, file, callback) => { 
    callback(null, ('images'))
  }, 
  filename: (req, file, callback) => { 
    callback(null, file.originalname)
  }
})

const upload = multer({ 
  storage: storage, 
  limits: {fileSize: 2 * 1024 * 1024}
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

export default uploadMiddleware