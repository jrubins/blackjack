import { combineReducers } from 'redux';
import _ from 'lodash';

import {
  CARD_DEALT,
  CARD_REVEALED,
  NUM_DECKS_SET,
} from '../../actions';

/**
 * Gets the new count value given the current count and the new card value.
 *
 * @param {Number} currentCount
 * @param {Number} cardValue
 * @returns {Number}
 */
function getNewCountValue(currentCount, cardValue) {
  let countAdjustment = 0;

  if (cardValue >= 10 || cardValue === 1) { // 10-Ace.
    countAdjustment = -1;
  } else if (cardValue > 1 && cardValue < 7) { // 2-6.
    countAdjustment = 1;
  }

  return (_.isNil(currentCount) ? 0 : currentCount) + countAdjustment;
}

function hiLoCount(state = null, action) {
  switch (action.type) {
    case CARD_DEALT: {
      const {
        cardValue,
        visible,
      } = action;

      // Don't adjust the count if the card was not visible to the player (i.e. dealer hidden card).
      if (!visible) {
        return state;
      }

      return getNewCountValue(state, cardValue);
    }

    case CARD_REVEALED: {
      const {
        cardValue,
      } = action;

      return getNewCountValue(state, cardValue);
    }

    default:
      return state;
  }
}

function numDecks(state = 1, action) {
  switch (action.type) {
    case NUM_DECKS_SET:
      return action.numDecks;

    default:
      return state;
  }
}

export default combineReducers({
  hiLoCount,
  numDecks,
});

// Selectors.
export const getCount = state => state.hiLoCount;
export const getNumDecks = state => state.numDecks;
