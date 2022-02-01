import React from 'react'
import clsx from 'clsx'

const TagPicker: React.FC<{
  onChange: (value: number) => void
  options: { label: string; value: number }[]
  selectedColor?: 'blue' | 'red'
  value: number | null
}> = ({ onChange, options, selectedColor = 'blue', value: curValue }) => {
  return (
    <div className="flex space-x-2">
      {options.map(({ label, value }, i) => {
        const isSelected = curValue === value

        return (
          <div
            key={i}
            className={clsx(
              'flex items-center justify-center w-12 h-12 transition duration-500 border cursor-pointer',
              {
                'border-light-grey text-light-grey hover:border-blue hover:text-blue': !isSelected,
                [`border-${selectedColor} text-${selectedColor}`]: isSelected,
              }
            )}
            onClick={() => onChange(value)}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}

export default TagPicker
