import { MouseEvent, ReactNode } from 'react'
import clsx from 'clsx'

const Button = ({
  children,
  isDisabled = false,
  isInverse = false,
  onClick,
  type = 'submit',
}: {
  children: ReactNode
  isDisabled?: boolean
  isInverse?: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  type: 'button' | 'submit'
}): JSX.Element => {
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
