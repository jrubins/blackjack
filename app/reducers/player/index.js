import { combineReducers } from 'redux';

import {
  PLAYER_LOST,
  PLAYER_WON,
  SET_BET,
} from '../../actions';

function balance(state = 100, action) {
  switch (action.type) {
    case SET_BET:
      return state - action.amount;

    case PLAYER_WON:
      return state + action.amount;

    case PLAYER_LOST:
      if (state === 0) {
        console.log('Resetting money');

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
