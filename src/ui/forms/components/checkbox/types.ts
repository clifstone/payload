export type CheckboxClassNames = {
  root?: string
  field?: string
  input?: string
  box?: string
  icon?: string
  label?: string
  alert?: string
}

export interface CheckboxProps {
  id?: string
  label?: string
  ariaLabel?: string
  alert?: string
  name?: string
  required?: boolean
  checked?: boolean
  value?: string
  disabled?: boolean
  className?: string
  classNames?: CheckboxClassNames
  onChange?: (checked: boolean) => void
}
