'use client'

import { useEffect, useId, useState } from 'react'
import clsx from 'clsx'
import CheckIcon from '@mui/icons-material/Check'

import { getCheckboxValidationMessage } from '../../utilities/validation'
import type { CheckboxProps } from './types'
export type { CheckboxClassNames, CheckboxProps } from './types'
export { getCheckboxValidationMessage }

const Checkbox = ({
  id,
  label = 'yer mudda',
  ariaLabel,
  alert,
  name,
  required,
  checked,
  value = 'on',
  disabled,
  className,
  classNames,
  onChange,
}: CheckboxProps) => {
  const rawId = useId()
  const sanitizedId = rawId.replace(/:/g, '')
  const checkboxId = id ?? `checkbox-${sanitizedId}`
  const alertId = `${checkboxId}-alert`

  const [checkedValue, setCheckedValue] = useState(checked ?? false)
  const hasLabel = !!label
  const fallbackAccessibleName = ariaLabel ?? name ?? label

  useEffect(() => {
    setCheckedValue(checked ?? false)
  }, [checked])

  const handleChange = (nextChecked: boolean) => {
    setCheckedValue(nextChecked)
    onChange?.(nextChecked)
  }

  return (
    <div className={clsx('w-full', className, classNames?.root)}>
      <label
        htmlFor={checkboxId}
        className={clsx(
          'group flex w-fit cursor-pointer items-start gap-3',
          disabled && 'cursor-not-allowed opacity-60',
          classNames?.field,
        )}
      >
        <span className="relative mt-0.5 inline-flex size-5 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            name={name}
            value={value}
            required={required}
            checked={checkedValue}
            disabled={disabled}
            aria-label={hasLabel ? undefined : fallbackAccessibleName}
            aria-invalid={!!alert}
            aria-required={required || undefined}
            aria-describedby={alert ? alertId : undefined}
            aria-errormessage={alert ? alertId : undefined}
            className={clsx('peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0', classNames?.input)}
            onChange={(event) => handleChange(event.target.checked)}
          />

          <span
            aria-hidden="true"
            className={clsx(
              'inline-flex size-5 items-center justify-center rounded border border-border bg-transparent text-transparent transition-colors',
              'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
              'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
              alert && 'border-red-500 text-red-500 peer-checked:border-red-500 peer-checked:bg-red-500',
              classNames?.box,
            )}
          >
            <i className="">
              <svg viewBox="466.667 538.925 1733.33 1588.81" fill="white" className='fill-white text-white'>
                <path d="m3500 8896.2s7.19 73.8 40.21 189.4c290.54 1016.9 1523.99 1408.8 2362.26 764 500.07-384.6 1099.48-991.4 1458.02-1863.6 0 0 3697.41 5546.5 8357.51 7892.2 239.6 120.7 529.1 104.7 749.1-48.8 10.9-7.5 21.9-15.5 32.9-23.8 0 0-5060-4170.3-8800.73-11493.5-189.41-370.8-723.82-356.9-892.98 23.5-530.57 1193.4-1454.14 3179.8-2146.44 4181.8-247.64 358.4-699.73 527.2-1114.66 394.4-15.08-4.8-30.15-10-45.19-15.6" transform="matrix(.13333333 0 0 -.13333333 0 2666.6667)"/>
              </svg>
            </i>
            {/* <CheckIcon
              className={clsx('size-4 transition-opacity', checkedValue ? 'opacity-100' : 'opacity-0', classNames?.icon)}
              fontSize="inherit"
            /> */}
          </span>
        </span>

        {hasLabel && (
          <span
            className={clsx(
              'select-none text-sm font-medium leading-6',
              alert && 'text-red-500',
              classNames?.label,
            )}
          >
            {label}
          </span>
        )}
      </label>

      {alert && (
        <div
          id={alertId}
          role="alert"
          className={clsx('mt-2 text-xs font-semibold text-red-500 tracking-[0.0375rem]', classNames?.alert)}
        >
          {alert}
        </div>
      )}
    </div>
  )
}

export default Checkbox
