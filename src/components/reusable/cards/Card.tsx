import React from 'react'

import { Card as CardInterface, SUITS } from '../../../utils/types'

import ClubIcon from '../icons/ClubIcon'
import DiamondIcon from '../icons/DiamondIcon'
import HeartIcon from '../icons/HeartIcon'
import SpadeIcon from '../icons/SpadeIcon'

const Card: React.FC<{
  card: CardInterface
  cardCovered: boolean
}> = ({ card, cardCovered }) => {
  const { number, suit } = card
  let cardNumber: CardInterface['number'] | 'A' | 'J' | 'K' | 'Q' = number
  let CardIcon: React.FC

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
    <div className="flex w-card h-card p-1 rounded bg-white shadow-card">
      {cardCovered && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white to-blue" />
      )}

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
  )
}

export default Card
