export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Minimum 8 characters" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Must include an uppercase letter" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Must include a lowercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Must include a number" }
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: "Must include a special character" }
  }
  return { valid: true, message: "" }
}
