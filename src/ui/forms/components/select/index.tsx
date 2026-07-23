'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import clsx from 'clsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { useFieldBorder } from '../../hooks/use-field-border'
import { useFieldInteraction } from '../../hooks/use-field-interaction'
import { getSelectValidationMessage } from '../../utilities/validation'
import type { SelectOption, SelectProps } from './types'
export type { SelectOption, SelectProps } from './types'
export { getSelectValidationMessage }

const sizeClasses = {
  tiny: 'text-xs px-4 py-3',
  small: 'text-sm px-4 py-3',
  medium: 'text-base px-5 py-3',
  large: 'text-lg px-5 py-4',
}

const shapeClasses = {
  round: 'rounded-full',
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

const getSelectedOption = (options: SelectOption[], value?: string) => {
  return options.find((option) => option.value === value)
}

const Select = ({
  id,
  label = 'yer mudda',
  ariaLabel,
  alert,
  name,
  required,
  value,
  placeholder = 'Select an option',
  options,
  searchThreshold = 8,
  size = 'large',
  shape = 'rounded',
  variant = 'default',
  onChange,
}: SelectProps) => {
  const rawId = useId()
  const sanitizedId = rawId.replace(/:/g, '')
  const selectId = id ?? `select-${sanitizedId}`
  const alertId = `${selectId}-alert`
  const listboxId = `${selectId}-listbox`
  const maskId = `select-border-mask-${sanitizedId}`

  const inputRef = useRef<HTMLInputElement | null>(null)
  const listboxRef = useRef<HTMLDivElement | null>(null)
  const [selectValue, setSelectValue] = useState(value ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const interaction = useFieldInteraction()

  const hasLabel = !!label
  const isSearchable = options.length >= searchThreshold
  const selectedOption = getSelectedOption(options, selectValue)
  const fallbackAccessibleName = ariaLabel ?? name ?? placeholder
  const displayValue = isOpen && isSearchable ? query : (selectedOption?.label ?? '')
  const shouldShowActiveBorder = interaction.isFocused || isOpen || !!alert

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!isSearchable || !normalizedQuery) return options

    return options.filter((option) => {
      return (
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [isSearchable, options, query])

  const border = useFieldBorder({
    hasAlert: !!alert,
    hasLabel,
    shape,
  })

  useEffect(() => {
    setSelectValue(value ?? '')
    interaction.resetInteractionHistory()
  }, [value])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, isOpen])

  const openListbox = () => {
    setIsOpen(true)
    interaction.handleFocusState()

    if (isSearchable) {
      setQuery('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  const closeListbox = () => {
    setIsOpen(false)
    setQuery('')
    interaction.handleBlurState()
  }

  const handleSelect = (option: SelectOption) => {
    setSelectValue(option.value)
    setIsOpen(false)
    setQuery('')
    interaction.markUserEdited()
    onChange?.(option.value)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      !isOpen &&
      isSearchable &&
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      setIsOpen(true)
      setQuery(event.key)
      interaction.handleFocusState()
      return
    }

    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      openListbox()
      return
    }

    if (!isOpen) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeListbox()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((currentIndex) =>
        Math.min(currentIndex + 1, Math.max(filteredOptions.length - 1, 0)),
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const activeOption = filteredOptions[activeIndex]

      if (activeOption) handleSelect(activeOption)
    }
  }

  const handleBlur = () => {
    window.setTimeout(() => {
      const activeElement = document.activeElement

      if (
        activeElement &&
        (inputRef.current?.contains(activeElement) || listboxRef.current?.contains(activeElement))
      ) {
        return
      }

      closeListbox()
    }, 0)
  }

  return (
    <div className="relative w-full">
      <div
        ref={border.fieldRef}
        className="relative w-full isolate"
      >
        {hasLabel && (
          <label
            ref={border.labelRef}
            htmlFor={selectId}
            className={clsx(
              'absolute left-4 top-0 -translate-y-1/2 z-10 px-1 uppercase font-bold bg-background',
              labelSizeClasses[size],
              variantLabelClasses[variant],
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={inputRef}
          id={selectId}
          type="text"
          role="combobox"
          aria-label={hasLabel ? undefined : fallbackAccessibleName}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete={isSearchable ? 'list' : 'none'}
          aria-activedescendant={
            isOpen && filteredOptions[activeIndex] ? `${selectId}-option-${activeIndex}` : undefined
          }
          aria-invalid={!!alert}
          aria-required={required || undefined}
          aria-describedby={alert ? alertId : undefined}
          aria-errormessage={alert ? alertId : undefined}
          required={required}
          readOnly={!isSearchable || !isOpen}
          className={clsx(
            'w-full ring-hidden outline-none outline-hidden relative z-10 bg-transparent pr-12 cursor-pointer',
            sizeClasses[size],
            shapeClasses[shape],
            alert && 'text-red-500',
            isSearchable && isOpen && 'cursor-text',
          )}
          value={displayValue}
          placeholder={placeholder || undefined}
          onClick={openListbox}
          onFocus={interaction.handleFocusState}
          onBlur={handleBlur}
          onMouseEnter={interaction.handleMouseEnter}
          onMouseLeave={interaction.handleMouseLeave}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        {name && (
          <input
            type="hidden"
            name={name}
            value={selectValue}
          />
        )}

        <button
          type="button"
          aria-label={
            isOpen
              ? `Close ${label || name || 'select'} options`
              : `Open ${label || name || 'select'} options`
          }
          aria-controls={listboxId}
          aria-expanded={isOpen}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex size-8 items-center justify-center text-current"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (isOpen) {
              closeListbox()
              return
            }

            openListbox()
          }}
        >
          <ExpandMoreIcon
            fontSize="small"
            className={clsx('transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

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
              <rect
                width="100%"
                height="100%"
                fill="white"
              />

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
            className={clsx('text-border', alert && 'text-red-500')}
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
            fill="none"
            stroke="currentColor"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={shouldShowActiveBorder ? 0 : 1}
            className={clsx(
              'stroke-2 transition-[stroke-dashoffset,stroke] ease-in-out',
              border.width > 480 ? 'duration-700' : 'duration-600',
              alert ? 'text-red-500' : 'text-primary',
            )}
            mask={`url(#${maskId})`}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[10001] max-h-64 overflow-auto rounded-lg border border-border bg-white p-2 shadow-lg"
          onMouseDown={(event) => event.preventDefault()}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = option.value === selectValue
              const isActive = index === activeIndex

              return (
                <button
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={clsx(
                    'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
                    isActive && 'bg-primary text-white font-bold',
                    !isActive && isSelected && 'bg-muted font-semibold',
                    !isActive && !isSelected && 'hover:bg-muted',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              )
            })
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">No options found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Select
