'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react'

import TextInput, {
  getTextInputValidationMessage,
  type TextInputProps,
} from '../components/text-input'
import Checkbox, { getCheckboxValidationMessage, type CheckboxProps } from '../components/checkbox'
import Select, { getSelectValidationMessage, type SelectProps } from '../components/select'
import Textarea, { getTextareaValidationMessage, type TextareaProps } from '../components/textarea'
import { validatePasswordConfirmation } from '../utilities/validation'
import clsx from 'clsx'

type FormProps = ComponentPropsWithoutRef<'form'>

interface Props extends Omit<FormProps, 'onSubmit'> {
  className?: string
  children?: ReactNode
  onSubmit?: FormProps['onSubmit']
}

type FormErrors = Record<string, string | undefined>
type FormValues = Record<string, boolean | string | undefined>
type FieldProps = TextInputProps | TextareaProps | SelectProps | CheckboxProps

const getFieldKey = (props: FieldProps, fallbackKey: string) => props.name || fallbackKey

const getConfirmFieldKey = (fieldKey: string) => `${fieldKey}-confirmation`

const getStringFieldValue = (values: FormValues, fieldKey: string, fallbackValue?: string) => {
  const value = values[fieldKey]

  return typeof value === 'string' ? value : (fallbackValue ?? '')
}

const isTextInputElement = (child: ReactNode): child is ReactElement<TextInputProps> => {
  return isValidElement(child) && child.type === TextInput
}

const isCheckboxElement = (child: ReactNode): child is ReactElement<CheckboxProps> => {
  return isValidElement(child) && child.type === Checkbox
}

const isTextareaElement = (child: ReactNode): child is ReactElement<TextareaProps> => {
  return isValidElement(child) && child.type === Textarea
}

const isSelectElement = (child: ReactNode): child is ReactElement<SelectProps> => {
  return isValidElement(child) && child.type === Select
}

const FormWrapper = ({
  className = 'flex flex-col gap-8',
  children,
  noValidate = true,
  onSubmit,
  ...formProps
}: Props) => {
  const [errors, setErrors] = useState<FormErrors>({})
  const [values, setValues] = useState<FormValues>({})

  const collectFieldErrors = (nodes: ReactNode, path = 'field') => {
    const nextErrors: FormErrors = {}

    Children.forEach(nodes, (child, index) => {
      const childPath = `${path}-${index}`

      if (isTextInputElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const confirmFieldKey = getConfirmFieldKey(fieldKey)
        const value = getStringFieldValue(values, fieldKey, child.props.value)
        const message = getTextInputValidationMessage({
          ...child.props,
          value,
        })

        if (message) {
          nextErrors[fieldKey] = message
        }

        if (!message && child.props.inputMode === 'password' && child.props.validatePassword) {
          const confirmedValue = getStringFieldValue(values, confirmFieldKey)
          const confirmMessage =
            value || confirmedValue
              ? validatePasswordConfirmation(value, confirmedValue)
              : undefined

          if (confirmMessage) {
            nextErrors[confirmFieldKey] = confirmMessage
          }
        }

        return
      }

      if (isCheckboxElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const value = values[fieldKey]
        const checked = typeof value === 'boolean' ? value : (child.props.checked ?? false)
        const message = getCheckboxValidationMessage({
          ...child.props,
          checked,
        })

        if (message) {
          nextErrors[fieldKey] = message
        }

        return
      }

      if (isTextareaElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const value = getStringFieldValue(values, fieldKey, child.props.value)
        const message = getTextareaValidationMessage({
          ...child.props,
          value,
        })

        if (message) {
          nextErrors[fieldKey] = message
        }

        return
      }

      if (isSelectElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const value = getStringFieldValue(values, fieldKey, child.props.value)
        const message = getSelectValidationMessage({
          ...child.props,
          value,
        })

        if (message) {
          nextErrors[fieldKey] = message
        }

        return
      }

      if (!isValidElement<{ children?: ReactNode }>(child)) return

      if (child.props.children) {
        Object.assign(nextErrors, collectFieldErrors(child.props.children, childPath))
      }
    })

    return nextErrors
  }

  const decorateChildren = (nodes: ReactNode, path = 'field'): ReactNode => {
    return Children.map(nodes, (child, index) => {
      const childPath = `${path}-${index}`

      if (!isValidElement(child)) return child

      if (isTextInputElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const confirmFieldKey = getConfirmFieldKey(fieldKey)

        return cloneElement(child, {
          alert: errors[fieldKey] ?? child.props.alert,
          confirmAlert: errors[confirmFieldKey] ?? child.props.confirmAlert,
          onChange: (value: string) => {
            setValues((currentValues) => ({
              ...currentValues,
              [fieldKey]: value,
            }))

            if (errors[fieldKey]) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                [fieldKey]: undefined,
              }))
            }

            child.props.onChange?.(value)
          },
          onConfirmChange: (value: string) => {
            setValues((currentValues) => ({
              ...currentValues,
              [confirmFieldKey]: value,
            }))

            if (errors[confirmFieldKey]) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                [confirmFieldKey]: undefined,
              }))
            }

            child.props.onConfirmChange?.(value)
          },
        })
      }

      if (isCheckboxElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)

        return cloneElement(child, {
          alert: errors[fieldKey] ?? child.props.alert,
          onChange: (checked: boolean) => {
            setValues((currentValues) => ({
              ...currentValues,
              [fieldKey]: checked,
            }))

            if (errors[fieldKey]) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                [fieldKey]: undefined,
              }))
            }

            child.props.onChange?.(checked)
          },
        })
      }

      if (isTextareaElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)

        return cloneElement(child, {
          alert: errors[fieldKey] ?? child.props.alert,
          onChange: (value: string) => {
            setValues((currentValues) => ({
              ...currentValues,
              [fieldKey]: value,
            }))

            if (errors[fieldKey]) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                [fieldKey]: undefined,
              }))
            }

            child.props.onChange?.(value)
          },
        })
      }

      if (isSelectElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)

        return cloneElement(child, {
          alert: errors[fieldKey] ?? child.props.alert,
          onChange: (value: string) => {
            setValues((currentValues) => ({
              ...currentValues,
              [fieldKey]: value,
            }))

            if (errors[fieldKey]) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                [fieldKey]: undefined,
              }))
            }

            child.props.onChange?.(value)
          },
        })
      }

      if (!isValidElement<{ children?: ReactNode }>(child)) return child

      if (!child.props.children) return child

      return cloneElement(child, {
        children: decorateChildren(child.props.children, childPath),
      })
    })
  }

  const handleSubmit: NonNullable<FormProps['onSubmit']> = (event) => {
    const nextErrors = collectFieldErrors(children)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
      return
    }

    onSubmit?.(event)
  }

  return (
    <form
      {...formProps}
      noValidate={noValidate}
      onSubmit={handleSubmit}
    >
      <div className={clsx(className && className)}>{decorateChildren(children)}</div>
    </form>
  )
}

export default FormWrapper
