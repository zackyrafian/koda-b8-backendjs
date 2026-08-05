export default function generateVA(method, orderId) { 
  if (!method.va_code || !method.va_length) { 
    throw new Error(`${method.name}`)
  }
  const randomLength = 4; 
  const idLength = method.va_length - method.va_code.length - randomLength;

  const unique = String(orderId).padStart(idLength, "0");
  if (unique.length > idLength) {
    throw new Error(`Order ID ${orderId} too long for payment method ${method.name}`)
  }
  const random = Math.floor(1000 + Math.random() * 9000)
  return `${method.va_code}${unique}${random}`
}