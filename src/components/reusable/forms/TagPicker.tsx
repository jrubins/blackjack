import clsx from 'clsx'

const TagPicker = ({
  onChange,
  options,
  selectedColor = 'primary',
  value: curValue,
}: {
  onChange: (value: number) => void
  options: { label: string; value: number }[]
  selectedColor?: 'primary' | 'red'
  value: number | null
}): JSX.Element => {
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
                'border-light-grey text-light-grey hover:border-primary hover:text-primary':
                  !isSelected,
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
