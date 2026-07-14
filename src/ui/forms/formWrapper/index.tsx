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
import Textarea, {
  getTextareaValidationMessage,
  type TextareaProps,
} from '../components/textarea'

type FormProps = ComponentPropsWithoutRef<'form'>

interface Props extends Omit<FormProps, 'onSubmit'> {
  children?: ReactNode
  onSubmit?: FormProps['onSubmit']
}

type FormErrors = Record<string, string | undefined>
type FormValues = Record<string, string | undefined>
type FieldProps = TextInputProps | TextareaProps

const getFieldKey = (props: FieldProps, fallbackKey: string) => props.name || fallbackKey

const isTextInputElement = (child: ReactNode): child is ReactElement<TextInputProps> => {
  return isValidElement(child) && child.type === TextInput
}

const isTextareaElement = (child: ReactNode): child is ReactElement<TextareaProps> => {
  return isValidElement(child) && child.type === Textarea
}

const FormWrapper = ({ children, noValidate = true, onSubmit, ...formProps }: Props) => {
  const [errors, setErrors] = useState<FormErrors>({})
  const [values, setValues] = useState<FormValues>({})

  const collectFieldErrors = (nodes: ReactNode, path = 'field') => {
    const nextErrors: FormErrors = {}

    Children.forEach(nodes, (child, index) => {
      const childPath = `${path}-${index}`

      if (isTextInputElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const value = values[fieldKey] ?? child.props.value ?? ''
        const message = getTextInputValidationMessage({
          ...child.props,
          value,
        })

        if (message) {
          nextErrors[fieldKey] = message
        }

        return
      }

      if (isTextareaElement(child)) {
        const fieldKey = getFieldKey(child.props, childPath)
        const value = values[fieldKey] ?? child.props.value ?? ''
        const message = getTextareaValidationMessage({
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
    <form {...formProps} noValidate={noValidate} onSubmit={handleSubmit}>
      {decorateChildren(children)}
    </form>
  )
}

export default FormWrapper
