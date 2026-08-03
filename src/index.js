import express from "express" 

const app = express(); 

app.get("/ping", (req, res) => { 
  res.status(200).json({ 
    "success": true,
    "message": "Pong"
  })
})

const PORT = 2222; 
app.listen(PORT, () => { 
  console.log(`Server Running PORT ${PORT}`)
})