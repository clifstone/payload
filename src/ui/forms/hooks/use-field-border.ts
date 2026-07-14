import { useLayoutEffect, useRef, useState } from 'react'

import type { FieldShape } from '../types/field'

type UseFieldBorderOptions = {
  hasLabel: boolean
  hasAlert: boolean
  shape: FieldShape
}

type FieldCutout = {
  x: number
  y: number
  width: number
  height: number
}

export const useFieldBorder = ({ hasAlert, hasLabel, shape }: UseFieldBorderOptions) => {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const labelRef = useRef<HTMLLabelElement | null>(null)
  const alertRef = useRef<HTMLDivElement | null>(null)
  const borderRef = useRef<SVGRectElement | null>(null)

  const [box, setBox] = useState({ width: 0, height: 0 })
  const [labelBox, setLabelBox] = useState({ x: 0, width: 0 })
  const [alertBox, setAlertBox] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [pathLength, setPathLength] = useState(0)

  useLayoutEffect(() => {
    if (!fieldRef.current) return

    const update = () => {
      const field = fieldRef.current
      const labelEl = labelRef.current
      const alertEl = alertRef.current
      const border = borderRef.current

      if (!field || !border) return

      const fieldRect = field.getBoundingClientRect()

      setBox({ width: fieldRect.width, height: fieldRect.height })

      if (labelEl) {
        const labelRect = labelEl.getBoundingClientRect()

        setLabelBox({
          x: labelRect.left - fieldRect.left,
          width: labelRect.width,
        })
      } else {
        setLabelBox({ x: 0, width: 0 })
      }

      if (alertEl) {
        const alertRect = alertEl.getBoundingClientRect()

        setAlertBox({
          x: alertRect.left - fieldRect.left,
          y: alertRect.top - fieldRect.top,
          width: alertRect.width,
          height: alertRect.height,
        })
      } else {
        setAlertBox({ x: 0, y: 0, width: 0, height: 0 })
      }

      setPathLength(border.getTotalLength())
    }

    update()

    const observer = new ResizeObserver(update)

    observer.observe(fieldRef.current)
    if (labelRef.current) observer.observe(labelRef.current)
    if (alertRef.current) observer.observe(alertRef.current)

    return () => observer.disconnect()
  }, [hasAlert, hasLabel])

  const radius = shape === 'round' ? box.height / 2 : shape === 'rounded' ? 8 : 0
  const gapPadding = 8
  const labelCutout: FieldCutout = {
    x: Math.max(labelBox.x - gapPadding, 0),
    y: -8,
    width: labelBox.width + gapPadding * 2,
    height: 16,
  }
  const alertCutout: FieldCutout = {
    x: Math.max(alertBox.x - gapPadding, 0),
    y: alertBox.y - 4,
    width: alertBox.width + gapPadding * 2,
    height: alertBox.height + 8,
  }

  return {
    fieldRef,
    labelRef,
    alertRef,
    borderRef,
    width: box.width,
    height: box.height,
    radius,
    pathLength,
    labelCutout,
    alertCutout,
  }
}
