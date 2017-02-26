import { combineReducers } from 'redux';

import player, * as fromPlayer from './player';

const reducers = combineReducers({
  player,
});

export default reducers;

// Player selectors.
export const getPlayerBalance = state => fromPlayer.getPlayerBalance(state.player);
