import React from 'react'

import CloseIcon from '../icons/CloseIcon'

const BasicStrategy: React.FC<{
  basicStrategyError: string
  basicStrategyOpen: boolean
  basicStrategyStreak?: number
  closeBasicStrategy: () => void
}> = ({
  basicStrategyError,
  basicStrategyOpen,
  basicStrategyStreak = 0,
  closeBasicStrategy,
}) => {
  if (!basicStrategyOpen) {
    return null
  }

  return (
    <div className="flex relative flex-wrap p-2 shadow-md">
      <div
        className="absolute top-0 right-0 cursor-pointer p-2 pb-0 text-light-grey"
        onClick={closeBasicStrategy}
      >
        <div className="w-6 h-6">
          <CloseIcon />
        </div>
      </div>
      <div className="w-full mb-4">
        <h3>Basic Strategy Advisor</h3>
      </div>
      <div className="flex">
        <div className="flex-shrink-0 flex relative items-center justify-center w-16 h-16 border border-light-grey rounded-full text-xl">
          <span className="absolute top-0 left-1/2 mt-2 transform -translate-x-1/2 text-dark-grey text-tiny font-bold uppercase">
            Streak
          </span>
          x{basicStrategyStreak}
        </div>
        <div className="flex items-center ml-4">{basicStrategyError}</div>
      </div>
    </div>
  )
}

export default BasicStrategy
