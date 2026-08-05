import * as paymentMetode from "../models/payment.model.js"

export async function getAll(req, res) {
  try { 
    const payments = await paymentMetode.findAll()
    res.status(200).json({ 
      "success": true, 
      "results": payments
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false,
      "message": error.message
    })
  }
}