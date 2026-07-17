'use client'

import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from 'react'
import clsx from 'clsx'
import { Theme as t } from '../../theme'
import Button from '@/ui/buttons/simple'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { useFieldBorder } from '../../hooks/use-field-border'
import { useFieldInteraction } from '../../hooks/use-field-interaction'
import { useNumberField } from '../../hooks/use-number-field'
import { normalizeFieldValue } from '../../utilities/normalization'
import { formatNorthAmericanPhoneDisplay, formatNorthAmericanPhoneE164 } from '../../utilities/telephone'
import { normalizeDecimalInput, normalizeIntegerInput } from '../../utilities/numbers'
import { getTextInputValidationMessage } from '../../utilities/validation'
import type { FieldStepDirection } from '../../types/field'
import type { TextInputProps } from './types'
export type { TextInputMode, TextInputProps } from './types'
export { getTextInputValidationMessage }

const getHtmlInputMode = (
  inputMode: TextInputProps['inputMode'],
): ComponentPropsWithoutRef<'input'>['inputMode'] => {
  return inputMode === 'password' ? undefined : inputMode
}

const getInitialInputValue = ({
  decimalPlaces,
  inputMode,
  max,
  min,
  value,
}: Pick<TextInputProps, 'decimalPlaces' | 'inputMode' | 'max' | 'min' | 'value'>) => {
  if (inputMode === 'tel') return formatNorthAmericanPhoneDisplay(value ?? '')
  if (inputMode === 'numeric') return normalizeIntegerInput(value ?? '', min, max)
  if (inputMode === 'decimal') return normalizeDecimalInput(value ?? '', { min, max, decimalPlaces })

  return value ?? ''
}

const TextInput = ({
  id,
  label = 'yer mudda',
  ariaLabel,
  alert,
  name,
  required,
  inputMode = 'text',
  min = 0,
  max = 1001,
  incrementBy = 1,
  decimalPlaces = 2,
  minLength,
  maxLength,
  validatePassword = false,
  validatePasswordLabel = 'Confirm password',
  confirmAlert,
  value,
  placeholder = 'Placeholder',
  size = 'large',
  shape = 'rounded',
  variant = 'default',
  onChange,
  onConfirmChange,
}: TextInputProps) => {
  const rawId = useId()
  const sanitizedId = rawId.replace(/:/g, '')
  const inputId = id ?? `text-input-${sanitizedId}`
  const alertId = `${inputId}-alert`
  const maskId = `input-border-mask-${sanitizedId}`

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState(() =>
    getInitialInputValue({ decimalPlaces, inputMode, max, min, value }),
  )
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const interaction = useFieldInteraction()

  const hasLabel = !!label
  const hasPredefinedValue = value !== undefined && value.length > 0
  const shouldShowActiveBorder = interaction.isFocused || !!alert
  const isTel = inputMode === 'tel'
  const isNumeric = inputMode === 'numeric'
  const isDecimal = inputMode === 'decimal'
  const isPassword = inputMode === 'password'
  const isNumberMode = isNumeric || isDecimal
  const formValue = isTel ? formatNorthAmericanPhoneE164(inputValue) : inputValue
  const htmlInputMode = getHtmlInputMode(inputMode)
  const fallbackAccessibleName = ariaLabel ?? name ?? placeholder

  const border = useFieldBorder({
    hasAlert: !!alert,
    hasLabel,
    shape,
  })

  const applyValue = (normalizedValue: string) => {
    setInputValue(normalizedValue)
    interaction.markUserEdited()
    onChange?.(normalizedValue)
  }

  const numberField = useNumberField({
    mode: isDecimal ? 'decimal' : 'integer',
    value: inputValue,
    min,
    max,
    incrementBy,
    decimalPlaces,
    onStep: applyValue,
  })

  useEffect(() => {
    setInputValue(getInitialInputValue({ decimalPlaces, inputMode, max, min, value }))
    interaction.resetInteractionHistory()
  }, [decimalPlaces, inputMode, max, min, value])

  const handleFocus = () => {
    interaction.handleFocusState()

    requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return

      if (alert && input.value.length > 0) {
        input.select()
        interaction.setHasFocusedOnce(true)
        return
      }

      if (isNumberMode && input.value.length > 0) {
        input.select()
        interaction.setHasFocusedOnce(true)
        return
      }

      if (hasPredefinedValue && !interaction.hasFocusedOnce && !interaction.hasUserEdited) {
        input.select()
      }

      interaction.setHasFocusedOnce(true)
    })
  }

  const handleChange = (nextValue: string) => {
    const normalizedValue = normalizeFieldValue(nextValue, {
      inputMode,
      currentValue: inputValue,
      min,
      max,
      decimalPlaces,
    })

    applyValue(normalizedValue)
  }

  const handleNumericStep = (direction: FieldStepDirection) => {
    numberField.stepBy(direction)
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((currentVisibility) => !currentVisibility)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isNumberMode) return

    if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === '+') {
      event.preventDefault()
      handleNumericStep(1)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === '-') {
      event.preventDefault()
      handleNumericStep(-1)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div ref={border.fieldRef} className="relative w-full isolate">
          {hasLabel && (
            <label
              ref={border.labelRef}
              htmlFor={inputId}
              className={clsx(
                t.label.base,
                t.label.sizes[size],
                t.variants[variant].label
              )}
            >
              {label}
            </label>
          )}

          <input
            ref={inputRef}
            id={inputId}
            type={isPassword && !isPasswordVisible ? 'password' : 'text'}
            name={isTel ? undefined : name}
            required={required}
            inputMode={htmlInputMode}
            minLength={minLength}
            maxLength={maxLength}
            autoComplete={isPassword ? 'current-password' : undefined}
            role={isNumberMode ? 'spinbutton' : undefined}
            aria-label={hasLabel ? undefined : fallbackAccessibleName}
            aria-invalid={!!alert}
            aria-required={required || undefined}
            aria-describedby={alert ? alertId : undefined}
            aria-errormessage={alert ? alertId : undefined}
            aria-valuemin={isNumberMode ? numberField.effectiveMin : undefined}
            aria-valuemax={isNumberMode ? numberField.effectiveMax : undefined}
            aria-valuenow={isNumberMode ? numberField.numericValue : undefined}
            className={clsx(
              t.input.base,
              t.input.sizes[size],
              t.input.shapes[shape],
              isNumberMode && 'pr-24',
              alert && 'text-red-500',
            )}
            value={inputValue}
            placeholder={placeholder || undefined}
            onMouseEnter={interaction.handleMouseEnter}
            onMouseLeave={interaction.handleMouseLeave}
            onFocus={handleFocus}
            onBlur={interaction.handleBlurState}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          {isTel && name && <input type="hidden" name={name} value={formValue} />}

          {alert && (
            <div
              id={alertId}
              ref={border.alertRef}
              role="alert"
              className="absolute right-4 bottom-0 translate-y-1/2 z-10 px-1 text-xs font-semibold text-red-500 tracking-[0.0375rem]"
            >
              {alert}
            </div>
          )}

          <svg
            aria-hidden="true"
            focusable="false"
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            width={border.width}
            height={border.height}
            viewBox={`0 0 ${border.width} ${border.height}`}
          >
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />

                {hasLabel && (
                  <rect
                    x={border.labelCutout.x}
                    y={border.labelCutout.y}
                    width={border.labelCutout.width}
                    height={border.labelCutout.height}
                    fill="black"
                  />
                )}

                {alert && (
                  <rect
                    x={border.alertCutout.x}
                    y={border.alertCutout.y}
                    width={border.alertCutout.width}
                    height={border.alertCutout.height}
                    fill="black"
                  />
                )}
              </mask>
            </defs>

            <rect
              x="0.5"
              y="0.5"
              width={Math.max(border.width - 1, 0)}
              height={Math.max(border.height - 1, 0)}
              rx={border.radius}
              ry={border.radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={1.55}
              className={clsx(
                'text-border',
                alert && 'text-red-500'
              )}
              mask={`url(#${maskId})`}
              shapeRendering="geometricPrecision"
              vectorEffect="non-scaling-stroke"
            />

            <rect
              ref={border.borderRef}
              x="1"
              y="1"
              width={Math.max(border.width - 2, 0)}
              height={Math.max(border.height - 2, 0)}
              rx={border.radius}
              ry={border.radius}
              fill="transparent"
              stroke="currentColor"
              strokeDasharray={border.pathLength}
              strokeDashoffset={shouldShowActiveBorder ? 0 : border.pathLength}
              className={clsx(
                'stroke-2 transition-[stroke-dashoffset,stroke] ease-in-out',
                border.width > 350 ? 'duration-600' : 'duration-300',
                alert && 'text-red-500',
                !alert && 'text-primary',
              )}
              mask={`url(#${maskId})`}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        {isPassword && (
          <div className="flex gap-2 items-center">
            <Button
              size='large'
              aria-controls={inputId}
              aria-label={isPasswordVisible ? `Hide ${label || name || 'password'}` : `Show ${label || name || 'password'}`}
              aria-pressed={isPasswordVisible}
              startIcon={isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={togglePasswordVisibility}
            />
          </div>
        )}
        {isNumberMode && (
          <div className="flex gap-2 items-center">
            <Button
              size='large'
              aria-controls={inputId}
              aria-label={`Decrease ${label || name || 'value'}`}
              startIcon={<RemoveIcon />}
              onClick={() => handleNumericStep(-1)}
              disabled={!numberField.canDecrement}
            />
            <Button
              size='large'
              aria-controls={inputId}
              aria-label={`Increase ${label || name || 'value'}`}
              startIcon={<AddIcon />}
              onClick={() => handleNumericStep(1)}
              disabled={!numberField.canIncrement}
            />
          </div>
        )}
      </div>

      {isPassword && validatePassword && (
        <TextInput
          label={validatePasswordLabel}
          alert={confirmAlert}
          required={required}
          inputMode="password"
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          size={size}
          shape={shape}
          variant={variant}
          onChange={onConfirmChange}
        />
      )}
    </div>
  )
}

export default TextInput
