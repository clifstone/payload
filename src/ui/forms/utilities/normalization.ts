import type { FieldInputMode } from '../types/field'
import { normalizeDecimalInput, normalizeIntegerInput } from './numbers'
import { formatNorthAmericanPhoneDigits, getNorthAmericanPhoneDigits } from './telephone'

type NormalizeFieldValueOptions = {
  inputMode: FieldInputMode
  currentValue?: string
  min?: number
  max?: number
  decimalPlaces?: number
}

export const normalizeFieldValue = (
  nextValue: string,
  { currentValue, decimalPlaces, inputMode, max, min }: NormalizeFieldValueOptions,
) => {
  switch (inputMode) {
    case 'numeric':
      return normalizeIntegerInput(nextValue, min, max)

    case 'decimal':
      return normalizeDecimalInput(nextValue, { min, max, decimalPlaces })

    case 'tel': {
      const currentDigits = getNorthAmericanPhoneDigits(currentValue ?? '')
      const nextDigits = getNorthAmericanPhoneDigits(nextValue)

      if (currentValue && nextValue.length < currentValue.length && nextDigits === currentDigits) {
        return formatNorthAmericanPhoneDigits(currentDigits.slice(0, -1))
      }

      return formatNorthAmericanPhoneDigits(nextDigits)
    }

    case 'email':
    case 'url':
      return nextValue.replace(/\s/g, '')

    case 'none':
    case 'search':
    case 'text':
    default:
      return nextValue
  }
}
