import type { FieldShape, FieldSize, FieldVariant } from '../../types/field'

export interface TextareaProps {
  id?: string
  label?: string
  ariaLabel?: string
  alert?: string
  name?: string
  required?: boolean
  value?: string
  placeholder?: string
  minLength?: number
  maxLength?: number
  rows?: number
  size?: FieldSize
  shape?: FieldShape
  variant?: FieldVariant
  onChange?: (value: string) => void
}
