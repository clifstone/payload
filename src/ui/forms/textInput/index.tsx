'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Theme as t } from '../theme'

interface TextInputProps {
  label?: string
  alert?: string
  isNum?: boolean
  value?: string
  placeholder?: string
  size?: 'tiny' | 'small' | 'medium' | 'large'
  shape?: 'round' | 'rounded' | 'square'
  onChange?: (value: string) => void
}

const TextInput = ({
  label = 'yer mudda',
  alert,
  isNum = false,
  value,
  placeholder = 'Placeholder',
  size = 'large',
  shape = 'rounded',
  onChange,
}: TextInputProps) => {
  const rawId = useId()
  const maskId = `input-border-mask-${rawId.replace(/:/g, '')}`

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const labelRef = useRef<HTMLLabelElement | null>(null)
  const alertRef = useRef<HTMLDivElement | null>(null)
  const borderRef = useRef<SVGRectElement | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [inputValue, setInputValue] = useState(value ?? '')
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [hasFocusedOnce, setHasFocusedOnce] = useState(false)

  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [box, setBox] = useState({ w: 0, h: 0 })
  const [labelBox, setLabelBox] = useState({ x: 0, w: 0 })
  const [alertBox, setAlertBox] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [pathLength, setPathLength] = useState(0)

  const hasLabel = !!label
  const hasPredefinedValue = value !== undefined && value.length > 0
  const shouldShowActiveBorder = isHovered || isFocused || isTyping || !!alert

  useEffect(() => {
    setInputValue(value ?? '')
    setHasUserEdited(false)
    setHasFocusedOnce(false)
  }, [value])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!wrapRef.current) return

    const update = () => {
      const wrap = wrapRef.current
      const labelEl = labelRef.current
      const alertEl = alertRef.current
      const border = borderRef.current

      if (!wrap || !border) return

      const wrapRect = wrap.getBoundingClientRect()

      setBox({ w: wrapRect.width, h: wrapRect.height })

      if (labelEl) {
        const labelRect = labelEl.getBoundingClientRect()

        setLabelBox({
          x: labelRect.left - wrapRect.left,
          w: labelRect.width,
        })
      } else {
        setLabelBox({ x: 0, w: 0 })
      }

      if (alertEl) {
        const alertRect = alertEl.getBoundingClientRect()

        setAlertBox({
          x: alertRect.left - wrapRect.left,
          y: alertRect.top - wrapRect.top,
          w: alertRect.width,
          h: alertRect.height,
        })
      } else {
        setAlertBox({ x: 0, y: 0, w: 0, h: 0 })
      }

      setPathLength(border.getTotalLength())
    }

    update()

    const observer = new ResizeObserver(update)

    observer.observe(wrapRef.current)
    if (labelRef.current) observer.observe(labelRef.current)
    if (alertRef.current) observer.observe(alertRef.current)

    return () => observer.disconnect()
  }, [label, alert])

  const handleFocus = () => {
    setIsFocused(true)

    requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return

      if (alert && input.value.length > 0) {
        input.select()
        setHasFocusedOnce(true)
        return
      }

      if (hasPredefinedValue && !hasFocusedOnce && !hasUserEdited) {
        input.select()
      }

      setHasFocusedOnce(true)
    })
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsTyping(false)

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
  }

  const handleChange = (nextValue: string) => {
    const normalizedValue = isNum ? nextValue.replace(/[^\d.]/g, '') : nextValue

    setInputValue(normalizedValue)
    setHasUserEdited(true)
    setIsTyping(true)
    onChange?.(normalizedValue)

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)

    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false)
      typingTimerRef.current = null
    }, 650)
  }

  const radius = shape === 'round' ? box.h / 2 : shape === 'rounded' ? 8 : 0

  const gapPadding = 8
  const labelGapX = Math.max(labelBox.x - gapPadding, 0)
  const labelGapW = labelBox.w + gapPadding * 2

  const alertGapX = Math.max(alertBox.x - gapPadding, 0)
  const alertGapY = alertBox.y - 4
  const alertGapW = alertBox.w + gapPadding * 2
  const alertGapH = alertBox.h + 8

  return (
    <div ref={wrapRef} className="relative w-full isolate">
      {hasLabel && (
        <label
          ref={labelRef}
          className={clsx(t.label.base, t.label.sizes[size], alert && 'text-red-500')}
        >
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="text"
        inputMode={isNum ? 'decimal' : undefined}
        className={clsx(
          t.input.base,
          t.input.sizes[size],
          t.input.shapes[shape],
          'relative z-10 bg-transparent outline-none',
          alert && 'text-red-500',
        )}
        value={inputValue}
        placeholder={placeholder || undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => handleChange(event.target.value)}
      />

      {alert && (
        <div
          ref={alertRef}
          className="absolute right-4 bottom-0 translate-y-1/2 z-10 px-1 text-xs text-red-500"
        >
          {alert}
        </div>
      )}

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        width={box.w}
        height={box.h}
        viewBox={`0 0 ${box.w} ${box.h}`}
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />

            {hasLabel && <rect x={labelGapX} y={-8} width={labelGapW} height={16} fill="black" />}

            {alert && (
              <rect x={alertGapX} y={alertGapY} width={alertGapW} height={alertGapH} fill="black" />
            )}
          </mask>
        </defs>

        <rect
          x="0.5"
          y="0.5"
          width={Math.max(box.w - 1, 0)}
          height={Math.max(box.h - 1, 0)}
          rx={radius}
          ry={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={1.55}
          className={clsx('text-border', alert && 'text-red-500')}
          mask={`url(#${maskId})`}
          shapeRendering="geometricPrecision"
          vectorEffect="non-scaling-stroke"
        />

        <rect
          ref={borderRef}
          x="1"
          y="1"
          width={Math.max(box.w - 2, 0)}
          height={Math.max(box.h - 2, 0)}
          rx={radius}
          ry={radius}
          fill="transparent"
          stroke="currentColor"
          strokeDasharray={pathLength}
          strokeDashoffset={shouldShowActiveBorder ? 0 : pathLength}
          className={clsx(
            'stroke-2 transition-[stroke-dashoffset,stroke] duration-250',
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

export default TextInput
