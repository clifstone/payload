import type { TextFieldValidation } from 'payload'

export const validateHexColor: TextFieldValidation = (value) => {
  if (!value) return true

  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
    ? true
    : 'Enter a valid hex color, such as #1A2B3C.'
}

export const validateHTTPURL: TextFieldValidation = (value) => {
  if (!value) return true

  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
      ? true
      : 'Enter a URL beginning with http:// or https://.'
  } catch {
    return 'Enter a valid URL beginning with http:// or https://.'
  }
}
