import _ from 'lodash'

import { Card, SUITS } from './types'

/**
 * Deals the next card in the deck.
 */
export function dealCard({
  deck,
  deckIndex,
}: {
  deck: Card[]
  deckIndex: number
}): { card: Card; deck: Card[]; deckIndex: number } {
  // Shuffle the deck if there are no more cards.
  if (deckIndex === deck.length) {
    console.info('Shuffling the deck...')

    const shuffledDeck = _.shuffle(deck)

    return {
      card: shuffledDeck[0],
      deck: shuffledDeck,
      deckIndex: 1,
    }
  }

  return {
    card: deck[deckIndex],
    deck,
    deckIndex: deckIndex + 1,
  }
}

/**
 * Returns the number of cards remaining in the deck.
 */
export function getNumCardsRemainingInDeck({
  deck,
  deckIndex,
}: {
  deck: Card[]
  deckIndex: number
}): number {
  return deck.length - deckIndex
}

/**
 * Creates a new deck with the number of decks provided.
 */
export function makeDeck(numDecks: number): Card[] {
  const suitKeys = _.values(SUITS)

  // Reset our deck to be empty.
  const deck: Card[] = []

  for (let i = 0; i < numDecks; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 13; k++) {
        deck.push({
          number: k + 1,
          suit: suitKeys[j],
        })
      }
    }
  }

  return _.shuffle(deck)
}

/**
 * Calculates the numerical total for the provided cards. Returns an object with a low and high value. If the two are
 * not equal, then there is an ace in the cards.
 */
export function sumCards(cards: Card[]): { low: number; high: number } {
  const cardTotal = cards.reduce(
    (sum, { number }) => sum + Math.min(number, 10),
    0
  )
  const hasAce = _.find(cards, { number: 1 })

  return {
    low: cardTotal,
    high: hasAce
      ? cardTotal + 10 > 21
        ? cardTotal
        : cardTotal + 10
      : cardTotal,
  }
}
