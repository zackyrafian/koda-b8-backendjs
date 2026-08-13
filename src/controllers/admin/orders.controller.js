import * as ordersModel from "../../models/users/orders.model.js"

export async function update(req, res) { 
  const { role } = req.user;  
  const { id } = req.params; 
  const { status } = req.body; 

  if (role !== "ADMIN") { 
    return res.status(403).json({ 
      success: false, 
      message: "Only admin can update order status."
    })
  }

  const orderId = Number(id); 
  if (!Number.isInteger(orderId)) { 
    return res.status(400).json({
      success: false,
      message: "Invalid order id",
    }); 
  }

  if (!status) { 
    return res.status(400).json({ 
      success: false, 
      message: "status is required",
    })
  }

  try { 
    const order = await ordersModel.updateStatus(orderId, status); 
    if (!order) { 
      return res.status(404).json({ 
        success: false,
        message: "Order not found", 
      })
    }
    return res.status(200).json({
      success: true, 
      message: "Success update status order", 
      result: order
    })
  } catch (error) { 
    res.status(500).json({ 
      success: false, 
      message: error.message
    })
  }
}

