export const getNorthAmericanPhoneDigits = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if ((value.trim().startsWith('+1') || digits.length > 10) && digits.startsWith('1')) {
    return digits.slice(1, 11)
  }

  return digits.slice(0, 10)
}

export const formatNorthAmericanPhoneDigits = (digits: string) => {
  if (digits.length <= 3) {
    return digits.length === 3 ? `(${digits})` : digits
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)})${digits.slice(3)}`
  }

  return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`
}

export const formatNorthAmericanPhoneDisplay = (value: string) =>
  formatNorthAmericanPhoneDigits(getNorthAmericanPhoneDigits(value))

export const formatNorthAmericanPhoneE164 = (value: string) => {
  const digits = getNorthAmericanPhoneDigits(value)

  return digits ? `+1${digits}` : ''
}
