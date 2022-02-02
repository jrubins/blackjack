import { motion } from 'framer-motion'
import clsx from 'clsx'

import { HAND_RESULTS, Card as CardInterface } from '../../../utils/types'
import { formatCurrency } from '../../../utils/text'
import { sumCards } from '../../../utils/cards'

import Card from './Card'
import ChevronDoubleLeftIcon from '../icons/ChevronDoubleLeftIcon'

const Hand = ({
  bet,
  cards,
  isDealer = false,
  isPlayerTurn,
  result,
  showActiveHandIndicator = false,
}: {
  bet?: number | null
  cards: CardInterface[]
  isDealer?: boolean
  isPlayerTurn: boolean
  result?: HAND_RESULTS | null
  showActiveHandIndicator?: boolean
}): JSX.Element => {
  // While it's the player's turn, we only show one of the dealer's cards.
  const cardsToSum = isDealer && isPlayerTurn ? cards.slice(0, 1) : cards
  const handTotal = sumCards(cardsToSum)
  let handTotalDisplay = ''
  if (isDealer || !isPlayerTurn) {
    // Always show the highest value for the dealer. Also, show the highest value for the player
    // when they are done deciding.
    handTotalDisplay = `${handTotal.high}`
  } else if (isPlayerTurn) {
    // Show both potential hand values when the player is still deciding.
    handTotalDisplay =
      handTotal.low !== handTotal.high
        ? `${handTotal.low}/${handTotal.high}`
        : `${handTotal.low}`
  }

  // Set the display of our result.
  let resultDisplay = ''
  const formattedBet = formatCurrency(bet || 0)
  if (result === HAND_RESULTS.WON) {
    resultDisplay = `won: +${formattedBet}`
  } else if (result === HAND_RESULTS.PUSH) {
    resultDisplay = `push: ${formattedBet}`
  } else if (result === HAND_RESULTS.LOST) {
    resultDisplay = `lost: -${formattedBet}`
  }

  return (
    <div className="flex">
      <div className="flex-grow relative h-card">
        {cards.map((card, i) => {
          const isHidden = isDealer && isPlayerTurn && i === 1

          return (
            <div
              key={i}
              className="relative"
              style={{
                left: 20 * i,
                zIndex: i,
              }}
            >
              <motion.div
                animate={{ rotateY: isHidden ? 180 : 0, x: 0 }}
                className="absolute top-0 left-0"
                initial={{ rotateY: isHidden ? 180 : 0, x: 100 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <Card card={card} isHidden={isHidden} />
              </motion.div>
            </div>
          )
        })}

        {showActiveHandIndicator && (
          <div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-active-hand"
            style={{
              // 80px is the width of a single card.
              left: 80 + cards.length * 20,
            }}
          >
            <div className="w-4 h-4 text-blue">
              <ChevronDoubleLeftIcon />
            </div>
          </div>
        )}
      </div>
      {cards.length > 0 && (
        <div className="flex flex-col justify-center w-28">
          <span className="mb-1 text-sm font-bold uppercase">
            Total: <span className="text-blue text-md">{handTotalDisplay}</span>
          </span>

          {!isDealer && (
            <>
              {bet && !result && (
                <span className="text-dark-grey text-sm uppercase">
                  At Risk: {formattedBet}
                </span>
              )}

              {result && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className={clsx('text-sm uppercase', {
                    'text-dark-grey': !result || result === HAND_RESULTS.PUSH,
                    'text-red': result === HAND_RESULTS.LOST,
                    'text-blue': result === HAND_RESULTS.WON,
                  })}
                  initial={{ opacity: 0 }}
                >
                  {resultDisplay}
                </motion.span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Hand
