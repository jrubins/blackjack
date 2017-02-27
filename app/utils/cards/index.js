import _ from 'lodash';

import { debug } from '../logs';

/**
 * The current deck being used to deal cards.
 *
 * @type {Array}
 */
let deck = [];

/**
 * The current position in the deck.
 *
 * @type {Number}
 */
let deckIndex = 0;

/**
 * The different types of suits.
 *
 * @type {Object}
 */
export const SUITS = {
  CLUBS: 'clubs',
  DIAMONDS: 'diamonds',
  HEARTS: 'hearts',
  SPADES: 'spades',
};

/**
 * Creates a new deck with the number of decks provided.
 *
 * @param {Number} numDecks
 */
export function makeDeck(numDecks) {
  const suitKeys = _.values(SUITS);

  for (let i = 0; i < numDecks; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 13; k++) {
        deck.push({
          number: (k + 1),
          suit: suitKeys[j],
        });
      }
    }
  }

  deck = _.shuffle(deck);
}

/**
 * Deals the next card in the deck.
 *
 * @returns {Object}
 */
export function dealCard() {
  // Shuffle the deck if there are no more cards.
  if (deckIndex === deck.length) {
    debug('Shuffling the deck...');

    deck = _.shuffle(deck);
    deckIndex = 0;
  }

  return deck[deckIndex++];
}

/**
 * Calculates the numerical total for the provided cards. Returns an object with a low and high value. If the two are
 * not equal, then there is an ace in the cards.
 *
 * @param {Array} cards
 * @returns {Object}
 */
export function sumCards(cards) {
  const cardTotal = cards.reduce((sum, { number }) => sum + Math.min(number, 10), 0);
  const hasAce = _.find(cards, { number: 1 });

  return {
    low: cardTotal,
    high: hasAce ? (cardTotal + 10 > 21 ? cardTotal : cardTotal + 10) : cardTotal,
  };
}
