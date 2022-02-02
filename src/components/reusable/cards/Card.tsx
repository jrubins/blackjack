import { FunctionComponent } from 'react'

import { Card as CardInterface, SUITS } from '../../../utils/types'

import ClubIcon from '../icons/ClubIcon'
import DiamondIcon from '../icons/DiamondIcon'
import HeartIcon from '../icons/HeartIcon'
import SpadeIcon from '../icons/SpadeIcon'

const Card = ({
  card,
  isHidden = false,
}: {
  card: CardInterface
  isHidden?: boolean
}): JSX.Element => {
  const { number, suit } = card
  let cardNumber: CardInterface['number'] | 'A' | 'J' | 'K' | 'Q' = number
  let CardIcon: FunctionComponent

  if (cardNumber === 1) {
    cardNumber = 'A'
  } else if (cardNumber === 11) {
    cardNumber = 'J'
  } else if (cardNumber === 12) {
    cardNumber = 'Q'
  } else if (cardNumber === 13) {
    cardNumber = 'K'
  }

  if (suit === SUITS.CLUBS) {
    CardIcon = ClubIcon
  } else if (suit === SUITS.DIAMONDS) {
    CardIcon = DiamondIcon
  } else if (suit === SUITS.HEARTS) {
    CardIcon = HeartIcon
  } else {
    CardIcon = SpadeIcon
  }

  return (
    <div className="relative w-card h-card rounded shadow-card">
      <div
        className="flex absolute inset-0 w-full h-full p-1 rounded bg-white"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div className="flex flex-col items-center w-4">
          <span>{cardNumber}</span>
          <div className="w-3 h-3">
            <CardIcon />
          </div>
        </div>
        <div className="flex-grow flex items-center">
          <div className="w-full">
            <CardIcon />
          </div>
        </div>
        <div className="flex flex-col items-center justify-end w-4">
          <span>{cardNumber}</span>
          <div className="w-3 h-3">
            <CardIcon />
          </div>
        </div>
      </div>

      {/* This is the back of the card */}
      <div
        className="absolute inset-0 w-full h-full rounded bg-gradient-to-b from-white to-blue"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: isHidden ? undefined : 'hidden',
          WebkitBackfaceVisibility: isHidden ? undefined : 'hidden',
        }}
      />
    </div>
  )
}

export default Card
