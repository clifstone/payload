export type NormalizeDecimalInputOptions = {
  min?: number
  max?: number
  decimalPlaces?: number
}

export const getEffectiveNumberMin = (min?: number) => Math.max(min ?? 0, 0)

export const getEffectiveNumberMax = (min: number, max?: number) => {
  if (max === undefined) return undefined

  return Math.max(max, min)
}

export const clampNumber = (value: number, min?: number, max?: number) => {
  const numericMin = getEffectiveNumberMin(min)
  const numericMax = getEffectiveNumberMax(numericMin, max)
  const clampedMinValue = Math.max(value, numericMin)

  return numericMax === undefined ? clampedMinValue : Math.min(clampedMinValue, numericMax)
}

export const normalizeDecimalPlaces = (decimalPlaces?: number) => {
  if (!Number.isFinite(decimalPlaces)) return 2

  return Math.max(Math.floor(decimalPlaces ?? 2), 0)
}

export const roundDecimal = (value: number, decimalPlaces: number) => {
  const factor = 10 ** decimalPlaces

  return Math.round((value + Number.EPSILON) * factor) / factor
}

export const formatDecimal = (value: number, decimalPlaces: number) => {
  const roundedValue = roundDecimal(value, decimalPlaces)

  if (decimalPlaces === 0) return String(Math.trunc(roundedValue))

  return roundedValue.toFixed(decimalPlaces).replace(/\.?0+$/, '')
}

export const getIntegerStep = (incrementBy: number) => Math.max(Math.abs(incrementBy), 1)

export const getDecimalStep = (incrementBy: number, decimalPlaces: number) => {
  const fallbackStep = decimalPlaces === 0 ? 1 : 1 / 10 ** decimalPlaces

  if (!Number.isFinite(incrementBy) || incrementBy <= 0) return fallbackStep

  const roundedStep = roundDecimal(incrementBy, decimalPlaces)

  return roundedStep > 0 ? roundedStep : fallbackStep
}

export const normalizeIntegerInput = (value: string, min?: number, max?: number) => {
  const numericMin = getEffectiveNumberMin(min)
  const digits = value.replace(/\D/g, '')
  const numericValue = digits ? Number(digits) : numericMin
  const clampedValue = clampNumber(numericValue, min, max)

  return String(clampedValue)
}

export const normalizeDecimalInput = (
  value: string,
  { min, max, decimalPlaces }: NormalizeDecimalInputOptions = {},
) => {
  const normalizedDecimalPlaces = normalizeDecimalPlaces(decimalPlaces)
  let nextValue = ''
  let hasDecimalPoint = false
  let fractionalLength = 0

  for (const character of value) {
    if (/\d/.test(character)) {
      if (hasDecimalPoint) {
        if (fractionalLength >= normalizedDecimalPlaces) continue
        fractionalLength += 1
      }

      nextValue += character
      continue
    }

    if (character === '.' && normalizedDecimalPlaces === 0) break

    if (character === '.' && !hasDecimalPoint) {
      hasDecimalPoint = true
      nextValue += character
    }
  }

  if (!nextValue || nextValue === '.' || nextValue.endsWith('.')) return nextValue

  const numericValue = Number(nextValue)
  const clampedValue = clampNumber(numericValue, min, max)

  return clampedValue === numericValue
    ? nextValue
    : formatDecimal(clampedValue, normalizedDecimalPlaces)
}

export const parseNumberInput = (value: string, fallbackValue: number) => {
  if (!value || value === '.' || value.endsWith('.')) return fallbackValue

  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue
}
