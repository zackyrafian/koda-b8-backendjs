export async function create(req, res) {
  const user_id = req.user.userId 
  const {
    recipient_name,
    phone_number,
    recipient_email,
    recipient_address_full,
    recipient_city,
    recipient_province,
    zip_code
  } = req.body;

  const request = { 
    recipient_name,
    phone_number,
    recipient_email,
    recipient_address_full,
    recipient_city,
    recipient_province,
    zip_code
  }
  try { 
    res.status(200).json({ 
      "success": true, 
      "message": "Success added address."
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}