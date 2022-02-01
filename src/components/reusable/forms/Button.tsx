import React, { MouseEvent, ReactNode } from 'react'
import clsx from 'clsx'

const Button: React.FC<{
  children: ReactNode
  isDisabled?: boolean
  isInverse?: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  type: 'button' | 'submit'
}> = ({
  children,
  isDisabled = false,
  isInverse = false,
  onClick,
  type = 'submit',
}) => {
  return (
    <button
      className={clsx(
        'relative w-full h-10 px-4 border border-light-grey rounded uppercase',
        {
          'bg-blue text-white': !isDisabled && !isInverse,
          'bg-off-white text-light-grey cursor-not-allowed': isDisabled,
          'bg-white text-blue': isInverse && !isDisabled,
        }
      )}
      onClick={(event) => {
        if (!isDisabled) {
          onClick(event)
        }
      }}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
