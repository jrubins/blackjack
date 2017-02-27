import { combineReducers } from 'redux';

import player, * as fromPlayer from './player';
import ui, * as fromUi from './ui';

const reducers = combineReducers({
  player,
  ui,
});

export default reducers;

// Player selectors.
export const getPlayerBalance = state => fromPlayer.getPlayerBalance(state.player);

// UI selectors.
export const isBasicStrategyOpen = state => fromUi.isBasicStrategyOpen(state.ui);
export const isMobileNavOpen = state => fromUi.isMobileNavOpen(state.ui);
