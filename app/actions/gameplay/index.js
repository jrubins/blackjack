import {
  NUM_DECKS_SET,
} from '../';

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
  };
}
