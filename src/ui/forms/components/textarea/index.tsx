'use client'

import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'

import { useFieldBorder } from '../../hooks/use-field-border'
import { useFieldInteraction } from '../../hooks/use-field-interaction'
import { getTextareaValidationMessage } from '../../utilities/validation'
import type { TextareaProps } from './types'
export type { TextareaProps } from './types'
export { getTextareaValidationMessage }

const sizeClasses = {
  tiny: 'text-xs px-4 py-3',
  small: 'text-sm px-4 py-3',
  medium: 'text-base px-5 py-3',
  large: 'text-lg px-5 py-4',
}

const shapeClasses = {
  round: 'rounded-3xl',
  rounded: 'rounded-lg',
  square: 'rounded-none',
}

const labelSizeClasses = {
  tiny: 'text-[0.6rem]',
  small: 'text-[0.7rem]',
  medium: 'text-[0.7rem]',
  large: 'text-[0.7rem] tracking-[0.05rem]',
}

const variantLabelClasses = {
  default: '',
  transparent: 'text-red-500',
}

const Textarea = ({
  id,
  label = 'yer mudda',
  ariaLabel,
  alert,
  name,
  required,
  value,
  placeholder = 'Placeholder',
  minLength,
  maxLength,
  rows = 4,
  size = 'large',
  shape = 'rounded',
  variant = 'default',
  onChange,
}: TextareaProps) => {
  const rawId = useId()
  const sanitizedId = rawId.replace(/:/g, '')
  const textareaId = id ?? `textarea-${sanitizedId}`
  const alertId = `${textareaId}-alert`
  const maskId = `textarea-border-mask-${sanitizedId}`

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [textareaValue, setTextareaValue] = useState(value ?? '')
  const interaction = useFieldInteraction()

  const hasLabel = !!label
  const shouldShowActiveBorder = interaction.isFocused || !!alert
  const fallbackAccessibleName = ariaLabel ?? name ?? placeholder

  const border = useFieldBorder({
    hasAlert: !!alert,
    hasLabel,
    shape,
  })

  useEffect(() => {
    setTextareaValue(value ?? '')
    interaction.resetInteractionHistory()
  }, [value])

  const handleChange = (nextValue: string) => {
    setTextareaValue(nextValue)
    interaction.markUserEdited()
    onChange?.(nextValue)
  }

  return (
    <div ref={border.fieldRef} className="relative w-full isolate">
      {hasLabel && (
        <label
          ref={border.labelRef}
          htmlFor={textareaId}
          className={clsx(
            'absolute left-4 top-0 -translate-y-1/2 z-10 px-1 uppercase font-bold bg-background',
            labelSizeClasses[size],
            variantLabelClasses[variant],
          )}
        >
          {label}
        </label>
      )}

      <textarea
        ref={textareaRef}
        id={textareaId}
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        aria-label={hasLabel ? undefined : fallbackAccessibleName}
        aria-invalid={!!alert}
        aria-required={required || undefined}
        aria-describedby={alert ? alertId : undefined}
        aria-errormessage={alert ? alertId : undefined}
        className={clsx(
          'w-full ring-hidden outline-none outline-hidden relative z-10 bg-transparent resize-y',
          sizeClasses[size],
          shapeClasses[shape],
          alert && 'text-red-500',
        )}
        value={textareaValue}
        placeholder={placeholder || undefined}
        onMouseEnter={interaction.handleMouseEnter}
        onMouseLeave={interaction.handleMouseLeave}
        onFocus={interaction.handleFocusState}
        onBlur={interaction.handleBlurState}
        onChange={(event) => handleChange(event.target.value)}
      />

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
            'stroke-2 transition-[stroke-dashoffset,stroke]',
            border.width > 350 ? 'duration-600' : 'duration-300',
            alert && 'text-red-500',
            !alert && 'text-primary',
          )}
          mask={`url(#${maskId})`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export default Textarea
