import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import { HAND_RESULTS } from '../../../utils/constants'
import { formatCurrency } from '../../../utils/text'
import { sumCards } from '../../../utils/cards'

import Card from './card'
import ChevronLeft from '../icons/chevronLeft'

const Hand = ({
  hand,
  isDealer,
  playerActionsEnabled,
  showActiveHandIndicator,
}) => {
  const {
    bet,
    cards,
    result,
  } = hand
  const handTotal = sumCards(hand.cards)
  const formattedBet = formatCurrency(bet)
  let handTotalDisplay
  let resultDisplay

  // Always show the highest value for the dealer. Also, show the highest value for the player
  // when they are done deciding.
  if (isDealer || !playerActionsEnabled) {
    handTotalDisplay = handTotal.high
  } else if (playerActionsEnabled) { // Show both values when the player is still deciding.
    handTotalDisplay = (
      handTotal.low !== handTotal.high
        ? `${handTotal.low}/${handTotal.high}`
        : handTotal.low
    )
  }

  // Set the display of our result.
  if (result === HAND_RESULTS.WON) {
    resultDisplay = `won: +${formattedBet}`
  } else if (result === HAND_RESULTS.PUSH) {
    resultDisplay = `push: ${formattedBet}`
  } else if (result === HAND_RESULTS.LOST) {
    resultDisplay = `lost: -${formattedBet}`
  }

  return (
    <div className="hand-container">
      <div className="hand-cards">
        {cards.map((card, i) => (
          <div
            key={i}
            className="hand-card"
            style={{
              left: 20 * i,
            }}
          >
            <Card
              card={card}
              cardCovered={isDealer && playerActionsEnabled && i === 1}
            />
          </div>
        ))}

        {showActiveHandIndicator &&
          <div
            className="active-hand-indicator"
            style={{
              // 80px is the width of a single card.
              left: 80 + (cards.length * 20),
            }}
          >
            <ChevronLeft />
            <ChevronLeft />
            <ChevronLeft />
          </div>
        }
      </div>
      {cards.length > 0 && (!isDealer || !playerActionsEnabled) &&
        <div className="hand-details">
          <span className="hand-total">
            Total: <span className="hand-total-number">{handTotalDisplay}</span>
          </span>

          {bet && !result &&
            <span className="hand-bet">
              At Risk: {formattedBet}
            </span>
          }

          {result &&
            <span
              className={cn('hand-result', {
                'hand-result-lost': result === HAND_RESULTS.LOST,
                'hand-result-push': result === HAND_RESULTS.PUSH,
                'hand-result-won': result === HAND_RESULTS.WON,
              })}
            >
              {resultDisplay}
            </span>
          }
        </div>
      }
    </div>
  )
}

Hand.propTypes = {
  hand: PropTypes.shape({
    bet: PropTypes.number,
    cards: PropTypes.array.isRequired,
    result: PropTypes.oneOf(_.values(HAND_RESULTS)),
  }).isRequired,
  isDealer: PropTypes.bool,
  playerActionsEnabled: PropTypes.bool.isRequired,
  showActiveHandIndicator: PropTypes.bool,
}

Hand.defaultProps = {
  isDealer: false,
  showActiveHandIndicator: false,
}

export default Hand
