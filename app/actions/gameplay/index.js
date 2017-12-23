import {
  CARD_DEALT,
  CARD_REVEALED,
  NUM_DECKS_SET,
} from '../'

/**
 * Indicates a card has been dealt.
 *
 * @param {Number} cardValue
 * @param {Object} [opts]
 * @param {Boolean} [opts.visible]
 * @returns {Object}
 */
export function cardDealt(cardValue, opts = {}) {
  const { visible } = opts

  return {
    type: CARD_DEALT,
    cardValue,
    visible,
  }
}

/**
 * Indicates a previously hidden card has been revealed.
 *
 * @param {Number} cardValue
 * @returns {Object}
 */
export function cardRevealed(cardValue) {
  return {
    type: CARD_REVEALED,
    cardValue,
  }
}

/**
 * Sets the number of decks in play.
 *
 * @param {Number} numDecks
 * @returns {Object}
 */
export function setNumDecks(numDecks) {
  return {
    type: NUM_DECKS_SET,
    numDecks,
  }
}
