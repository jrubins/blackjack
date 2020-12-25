import React from 'react'
import cn from 'classnames'

import { HAND_RESULTS, Card as CardInterface } from '../../../utils/types'
import { formatCurrency } from '../../../utils/text'
import { sumCards } from '../../../utils/cards'

import Card from './Card'
import ChevronDoubleLeftIcon from '../icons/ChevronDoubleLeftIcon'

const Hand: React.FC<{
  bet?: number | null
  cards: CardInterface[]
  isDealer?: boolean
  playerActionsEnabled: boolean
  result?: HAND_RESULTS | null
  showActiveHandIndicator?: boolean
}> = ({
  bet,
  cards,
  isDealer = false,
  playerActionsEnabled,
  result,
  showActiveHandIndicator = false,
}) => {
  // Always show the highest value for the dealer. Also, show the highest value for the player
  // when they are done deciding.
  const handTotal = sumCards(cards)
  let handTotalDisplay = ''
  if (isDealer || !playerActionsEnabled) {
    handTotalDisplay = `${handTotal.high}`
  } else if (playerActionsEnabled) {
    // Show both values when the player is still deciding.
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
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative"
            style={{
              left: 20 * i,
            }}
          >
            <div className="absolute top-0 left-0">
              <Card
                card={card}
                cardCovered={isDealer && playerActionsEnabled && i === 1}
              />
            </div>
          </div>
        ))}

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
      {cards.length > 0 && (!isDealer || !playerActionsEnabled) && (
        <div className="flex flex-col justify-center w-28">
          <span className="mb-1 text-sm font-bold uppercase">
            Total: <span className="text-blue text-md">{handTotalDisplay}</span>
          </span>

          {bet && !result && (
            <span className="text-dark-grey text-sm uppercase">
              At Risk: {formattedBet}
            </span>
          )}

          {result && (
            <span
              className={cn('text-dark-grey text-sm uppercase', {
                'text-red': result === HAND_RESULTS.LOST,
                'text-blue': result === HAND_RESULTS.WON,
              })}
            >
              {resultDisplay}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Hand
