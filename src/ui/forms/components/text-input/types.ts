import type { FieldInputMode, FieldShape, FieldSize, FieldVariant } from '../../types/field'

export type TextInputMode = FieldInputMode

export interface TextInputProps {
  id?: string
  label?: string
  ariaLabel?: string
  alert?: string
  name?: string
  required?: boolean
  value?: string
  placeholder?: string
  inputMode?: FieldInputMode
  min?: number
  max?: number
  incrementBy?: number
  decimalPlaces?: number
  minLength?: number
  maxLength?: number
  validatePassword?: boolean
  validatePasswordLabel?: string
  confirmAlert?: string
  size?: FieldSize
  shape?: FieldShape
  variant?: FieldVariant
  onChange?: (value: string) => void
  onConfirmChange?: (value: string) => void
}
