import type { FieldStepDirection } from '../types/field'
import {
  clampNumber,
  formatDecimal,
  getDecimalStep,
  getEffectiveNumberMax,
  getEffectiveNumberMin,
  getIntegerStep,
  normalizeDecimalPlaces,
  parseNumberInput,
} from '../utilities/numbers'

type NumberFieldMode = 'integer' | 'decimal'

type UseNumberFieldOptions = {
  mode: NumberFieldMode
  value: string
  min?: number
  max?: number
  incrementBy?: number
  decimalPlaces?: number
  onStep: (value: string) => void
}

export const useNumberField = ({
  decimalPlaces,
  incrementBy = 1,
  max,
  min,
  mode,
  onStep,
  value,
}: UseNumberFieldOptions) => {
  const normalizedDecimalPlaces = normalizeDecimalPlaces(decimalPlaces)
  const numericMin = getEffectiveNumberMin(min)
  const numericMax = getEffectiveNumberMax(numericMin, max)
  const step =
    mode === 'decimal'
      ? getDecimalStep(incrementBy, normalizedDecimalPlaces)
      : getIntegerStep(incrementBy)
  const numericValue = parseNumberInput(value, numericMin)
  const canDecrement = numericValue > numericMin
  const canIncrement = numericMax === undefined || numericValue < numericMax

  const stepBy = (direction: FieldStepDirection) => {
    const nextNumericValue = clampNumber(numericValue + step * direction, min, max)

    onStep(
      mode === 'decimal'
        ? formatDecimal(nextNumericValue, normalizedDecimalPlaces)
        : String(nextNumericValue),
    )
  }

  return {
    numericValue,
    step,
    effectiveMin: numericMin,
    effectiveMax: numericMax,
    canIncrement,
    canDecrement,
    increment: () => stepBy(1),
    decrement: () => stepBy(-1),
    stepBy,
  }
}
