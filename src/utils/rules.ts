import { Card } from './types'

export function canDouble({
  balance,
  bet,
  cards,
}: {
  balance: number
  bet: number
  cards: Card[]
}): boolean {
  return cards.length === 2 && balance >= bet
}

export function canSplit({
  balance,
  bet,
  cards,
}: {
  balance: number
  bet: number
  cards: Card[]
}): boolean {
  return (
    cards.length === 2 && cards[0].number === cards[1].number && balance >= bet
  )
}
