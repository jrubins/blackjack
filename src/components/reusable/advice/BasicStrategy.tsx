import CloseIcon from '../icons/CloseIcon'

const BasicStrategy = ({
  basicStrategyError,
  basicStrategyStreak = 0,
  closeBasicStrategy,
}: {
  basicStrategyError: string
  basicStrategyStreak?: number
  closeBasicStrategy: () => void
}): JSX.Element => {
  return (
    <div className="relative h-full p-2 shadow-md">
      <div
        className="absolute top-0 right-0 cursor-pointer p-2 pb-0 text-light-grey"
        onClick={closeBasicStrategy}
      >
        <div className="w-6 h-6">
          <CloseIcon />
        </div>
      </div>
      <h2 className="mb-2">Basic Strategy Advisor</h2>
      <div className="flex">
        <div className="flex-shrink-0 flex relative items-center justify-center w-16 h-16 border border-light-grey rounded-full text-xl">
          <span className="absolute top-0 left-1/2 mt-2 transform -translate-x-1/2 text-dark-grey text-tiny font-bold uppercase">
            Streak
          </span>
          x{basicStrategyStreak}
        </div>
        <div className="flex items-center ml-4 text-sm">
          {basicStrategyError}
        </div>
      </div>
    </div>
  )
}

export default BasicStrategy
