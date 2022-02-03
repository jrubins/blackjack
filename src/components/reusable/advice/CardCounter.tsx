import clsx from 'clsx'

import { CountOption } from '../../../utils/types'

import CloseIcon from '../icons/CloseIcon'
import TagPicker from '../forms/TagPicker'

const CardCounter = ({
  closeCardCounter,
  count,
  countGuess,
  countOptions,
  onCountGuess,
}: {
  closeCardCounter: () => void
  count: number | null
  countGuess: number | null
  countOptions: CountOption[]
  onCountGuess: (countGuess: number) => void
}): JSX.Element => {
  const correctCountGuess = countGuess === count

  return (
    <div className="relative h-full p-2 shadow-md">
      <div
        className="absolute top-0 right-0 cursor-pointer p-2 pb-0 text-light-grey"
        onClick={closeCardCounter}
      >
        <div className="w-6 h-6">
          <CloseIcon />
        </div>
      </div>
      <h2 className="mb-2">Card Counter</h2>
      {count === null && (
        <p className="text-sm">Start a round to guess the current count.</p>
      )}
      {count !== null && (
        <div>
          <div className="mb-2 text-dark-grey text-xs font-bold uppercase">
            What's the count?
          </div>

          <div className="flex items-center">
            <TagPicker
              onChange={onCountGuess}
              options={countOptions}
              selectedColor={correctCountGuess ? 'primary' : 'red'}
              value={countGuess}
            />

            {countGuess !== null && (
              <div
                className={clsx('ml-4 text-xs font-bold uppercase', {
                  'text-primary': correctCountGuess,
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
