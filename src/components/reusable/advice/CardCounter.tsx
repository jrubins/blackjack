import React from 'react'
import cn from 'classnames'

import { CountOption } from '../../../utils/types'

import CloseIcon from '../icons/CloseIcon'
import TagPicker from '../forms/TagPicker'

const CardCounter: React.FC<{
  cardCounterOpen: boolean
  closeCardCounter: () => void
  count: number | null
  countGuess: number | null
  countOptions: CountOption[]
  onCountGuess: (countGuess: number) => void
}> = ({
  cardCounterOpen,
  closeCardCounter,
  count,
  countGuess,
  countOptions,
  onCountGuess,
}) => {
  const correctCountGuess = countGuess === count

  if (!cardCounterOpen) {
    return null
  }

  return (
    <div className="flex relative flex-wrap p-2 shadow-md">
      <div
        className="absolute top-0 right-0 cursor-pointer p-2 pb-0 text-light-grey"
        onClick={closeCardCounter}
      >
        <div className="w-6 h-6">
          <CloseIcon />
        </div>
      </div>
      <div className="w-full">
        <h3>Card Counter</h3>
      </div>
      {count !== null && (
        <div>
          <div className="mb-2 text-dark-grey text-xs font-bold uppercase">
            What's the count?
          </div>

          <div className="flex items-center">
            <TagPicker
              onChange={onCountGuess}
              options={countOptions}
              selectedColor={correctCountGuess ? 'blue' : 'red'}
              value={countGuess}
            />

            {countGuess !== null && (
              <div
                className={cn('ml-4 text-xs font-bold uppercase', {
                  'text-blue': correctCountGuess,
                  'text-red': !correctCountGuess,
                })}
              >
                {correctCountGuess ? 'Correct' : 'Incorrect'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CardCounter
