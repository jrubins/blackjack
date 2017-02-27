import { combineReducers } from 'redux';

import {
  DEDUCT_BALANCE,
  PLAYER_LOST,
  PLAYER_WON,
} from '../../actions';

function balance(state = 100, action) {
  switch (action.type) {
    case DEDUCT_BALANCE:
      return state - action.amount;

    case PLAYER_WON:
      return state + action.amount;

    case PLAYER_LOST:
      // Temporary reset of balance when you run out.
      if (state === 0) {
        return 100;
      }

      return state;

    default:
      return state;
  }
}

export default combineReducers({
  balance,
});

export const getPlayerBalance = state => state.balance;
