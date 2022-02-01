import clsx from 'clsx'

interface SliderOption {
  label: string
  value: boolean
}

const SlidingToggle = ({
  onChange,
  options,
  value,
}: {
  onChange: (value: boolean) => void
  options: [SliderOption, SliderOption]
  value: boolean
}): JSX.Element => {
  const { label: activeOptionLabel, value: activeOptionValue } = options[0]
  const inactiveOptionLabel = options[1].label
  const isSliderActive = value === activeOptionValue
  const ballPosition = isSliderActive ? 'translate-x-12' : 'translate-x-2'
  const labelClasses =
    'absolute top-1/2 w-10 transform -translate-y-1/2 text-xs text-center'

  return (
    <div
      className={clsx(
        'flex relative items-center justify-between w-20 h-8 transition rounded-full text-white uppercase cursor-pointer select-none',
        {
          'bg-blue': isSliderActive,
          'bg-light-grey': !isSliderActive,
        }
      )}
      onClick={() => {
        const newActiveOptionIndex = isSliderActive ? 1 : 0

        onChange(options[newActiveOptionIndex].value)
      }}
    >
      <div
        className={`absolute right-0 left-0 w-6 h-6 transition duration-300 transform ${ballPosition} rounded-full bg-white`}
      />

      <div
        className={`${labelClasses} left-2 ${
          isSliderActive ? '' : 'invisible'
        }`}
      >
        {activeOptionLabel}
      </div>

      <div
        className={`${labelClasses} right-1 ${
          isSliderActive ? 'invisible' : ''
        }`}
      >
        {inactiveOptionLabel}
      </div>
    </div>
  )
}

export default SlidingToggle
