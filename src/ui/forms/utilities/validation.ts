import type { FieldInputMode } from '../types/field'
import {
  getEffectiveNumberMax,
  getEffectiveNumberMin,
  normalizeDecimalPlaces,
} from './numbers'
import { getNorthAmericanPhoneDigits } from './telephone'

type TextInputValidationOptions = {
  decimalPlaces?: number
  inputMode?: FieldInputMode
  label?: string
  max?: number
  maxLength?: number
  min?: number
  minLength?: number
  required?: boolean
  value?: string
}

type TextareaValidationOptions = {
  label?: string
  maxLength?: number
  minLength?: number
  required?: boolean
  value?: string
}

type SelectValidationOptions = {
  label?: string
  required?: boolean
  value?: string
}

type CheckboxValidationOptions = {
  checked?: boolean
  label?: string
  required?: boolean
}

export const validateRequired = (value: string, label?: string) => {
  return value ? undefined : label ? `${label} is required.` : 'This field is required.'
}

export const validateMinLength = (value: string, minLength?: number) => {
  if (minLength === undefined || value.length >= minLength) return undefined

  return `Enter at least ${minLength} characters.`
}

export const validateMaxLength = (value: string, maxLength?: number) => {
  if (maxLength === undefined || value.length <= maxLength) return undefined

  return `Enter no more than ${maxLength} characters.`
}

export const validateNumberBounds = (value: number, min?: number, max?: number) => {
  const numericMin = getEffectiveNumberMin(min)
  const numericMax = getEffectiveNumberMax(numericMin, max)

  if (value < numericMin) return `Enter a value of at least ${numericMin}.`
  if (numericMax !== undefined && value > numericMax) {
    return `Enter a value no greater than ${numericMax}.`
  }

  return undefined
}

export const validateInteger = (value: string, min?: number, max?: number) => {
  if (!/^\d+$/.test(value)) return 'Enter a valid number.'

  return validateNumberBounds(Number(value), min, max)
}

export const validateDecimal = (
  value: string,
  { decimalPlaces, max, min }: Pick<TextInputValidationOptions, 'decimalPlaces' | 'max' | 'min'>,
) => {
  const normalizedDecimalPlaces = normalizeDecimalPlaces(decimalPlaces)
  const decimalPattern =
    normalizedDecimalPlaces === 0
      ? /^\d+$/
      : new RegExp(`^(\\d+|\\d+\\.\\d{1,${normalizedDecimalPlaces}}|\\.\\d{1,${normalizedDecimalPlaces}})$`)

  if (!decimalPattern.test(value)) {
    if (
      normalizedDecimalPlaces > 0 &&
      /^(\d+)?\.\d+$/.test(value) &&
      value.split('.')[1].length > normalizedDecimalPlaces
    ) {
      return `Enter no more than ${normalizedDecimalPlaces} decimal places.`
    }

    return 'Enter a valid decimal number.'
  }

  return validateNumberBounds(Number(value), min, max)
}

export const validateNorthAmericanPhone = (value: string) => {
  return getNorthAmericanPhoneDigits(value).length === 10
    ? undefined
    : 'Enter a valid phone number.'
}

export const validateEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? undefined
    : 'Enter a valid email address.'
}

export const validateUrl = (value: string) => {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`)

    return url.hostname.includes('.') ? undefined : 'Enter a valid URL.'
  } catch {
    return 'Enter a valid URL.'
  }
}

export const validatePasswordConfirmation = (password: string, confirmedPassword: string) => {
  if (!confirmedPassword) return 'Confirm your password.'

  return password === confirmedPassword ? undefined : 'Passwords do not match.'
}

export const getTextInputValidationMessage = ({
  decimalPlaces,
  inputMode = 'text',
  label,
  max,
  maxLength,
  min,
  minLength,
  required,
  value,
}: TextInputValidationOptions) => {
  const trimmedValue = value?.trim() ?? ''

  if (required) {
    const requiredMessage = validateRequired(trimmedValue, label)

    if (requiredMessage) return requiredMessage
  }

  if (!trimmedValue) return undefined

  switch (inputMode) {
    case 'numeric':
      return validateInteger(trimmedValue, min, max)

    case 'decimal':
      return validateDecimal(trimmedValue, { decimalPlaces, max, min })

    case 'tel':
      return validateNorthAmericanPhone(trimmedValue)

    case 'email':
      return validateEmail(trimmedValue)

    case 'url':
      return validateUrl(trimmedValue)

    case 'password':
      return validateMinLength(trimmedValue, minLength) ?? validateMaxLength(trimmedValue, maxLength)

    case 'none':
    case 'search':
    case 'text':
    default:
      return undefined
  }
}

export const getTextareaValidationMessage = ({
  label,
  maxLength,
  minLength,
  required,
  value,
}: TextareaValidationOptions) => {
  const trimmedValue = value?.trim() ?? ''
  const rawValue = value ?? ''

  if (required) {
    const requiredMessage = validateRequired(trimmedValue, label)

    if (requiredMessage) return requiredMessage
  }

  if (!rawValue) return undefined

  return validateMinLength(rawValue, minLength) ?? validateMaxLength(rawValue, maxLength)
}

export const getSelectValidationMessage = ({
  label,
  required,
  value,
}: SelectValidationOptions) => {
  if (!required) return undefined

  return validateRequired(value ?? '', label)
}

export const getCheckboxValidationMessage = ({
  checked,
  label,
  required,
}: CheckboxValidationOptions) => {
  if (!required) return undefined

  return validateRequired(checked ? 'checked' : '', label)
}
