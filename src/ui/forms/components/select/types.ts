import type { FieldShape, FieldSize, FieldVariant } from '../../types/field'

export type SelectOption = {
  label: string
  value: string
}

export interface SelectProps {
  id?: string
  label?: string
  ariaLabel?: string
  alert?: string
  name?: string
  required?: boolean
  value?: string
  placeholder?: string
  options: SelectOption[]
  searchThreshold?: number
  size?: FieldSize
  shape?: FieldShape
  variant?: FieldVariant
  onChange?: (value: string) => void
}
