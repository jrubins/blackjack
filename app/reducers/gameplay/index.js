import { combineReducers } from 'redux';

import {
  NUM_DECKS_SET,
} from '../../actions';

function numDecks(state = 1, action) {
  switch (action.type) {
    case NUM_DECKS_SET:
      return action.numDecks;

    default:
      return state;
  }
}

export default combineReducers({
  numDecks,
});

// Selectors.
export const getNumDecks = state => state.numDecks;
