import React from 'react'
import clsx from 'clsx'
import { Theme as t, ButtonVariant, ButtonColor, ButtonSize, ButtonShape } from './theme'
import Client from './client'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  startIcon?: React.ReactNode | null
  endIcon?: React.ReactNode | null
  size?: ButtonSize
  variant?: ButtonVariant
  shape?: ButtonShape
  color?: ButtonColor
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
  drawer?: any // Replace 'any' with the actual type if known
  modal?: any // Replace 'any' with the actual type if known
  modalData?: any // Replace 'any' with the actual type if known
  transition?: any // Replace 'any' with the actual type if known
  navigateTo?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  [key: string]: any // For additional props
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  startIcon = null,
  endIcon = null,
  size = 'medium',
  variant = 'text',
  shape = 'rounded',
  color = 'plain',
  disabled = false,
  loading = false,
  children,
  drawer,
  modal,
  modalData,
  transition,
  navigateTo,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={props.onClick}
      className={clsx(
        t.base,
        t.sizes.buttonSize[size],
        t.shapes[shape],
        t.variants[variant].base,
        t.variants[variant].colors[color as keyof (typeof t.variants)[typeof variant]['colors']],
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        props.className,
      )}
      {...props}
    >
      {loading && (
        <i className={clsx(t.sizes.iconSize[size])}>
          {/* Add a loading spinner icon here if needed */}
        </i>
      )}
      {!loading && startIcon && <i className={clsx(t.sizes.iconSize[size])}>{startIcon}</i>}
      {children && !loading && <span>{children}</span>}
      {!loading && endIcon && <i className={clsx(t.sizes.iconSize[size])}>{endIcon}</i>}
      <Client
        drawer={drawer}
        modal={modal}
        modalData={modalData}
        navigateTo={navigateTo}
        transition={transition}
      />
    </button>
  )
}

export default Button
