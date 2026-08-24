export function parseIntId(value) { 
  const id = Number(value); 
  return Number.isInteger(id) && id > 0 ? id : null; 
}

export function requireFields(obj, fields) {
  const missing = fields.filter(f => obj[f] === undefined || obj[f] === null || obj[f] === "")
  return missing.length ? missing : null
}