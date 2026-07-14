import { useState } from 'react'

export const useFieldInteraction = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [hasFocusedOnce, setHasFocusedOnce] = useState(false)

  return {
    isHovered,
    isFocused,
    hasUserEdited,
    hasFocusedOnce,
    handleMouseEnter: () => setIsHovered(true),
    handleMouseLeave: () => setIsHovered(false),
    handleFocusState: () => setIsFocused(true),
    handleBlurState: () => setIsFocused(false),
    markUserEdited: () => setHasUserEdited(true),
    setHasFocusedOnce,
    resetInteractionHistory: () => {
      setHasUserEdited(false)
      setHasFocusedOnce(false)
    },
  }
}
