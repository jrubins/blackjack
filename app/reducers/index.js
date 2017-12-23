import { combineReducers } from 'redux'

import gameplay, * as fromGameplay from './gameplay'
import player, * as fromPlayer from './player'
import ui, * as fromUi from './ui'

const reducers = combineReducers({
  gameplay,
  player,
  ui,
})

export default reducers

// Gameplay selectors.
export const getCount = state => fromGameplay.getCount(state.gameplay)
export const getNumDecks = state => fromGameplay.getNumDecks(state.gameplay)

// Player selectors.
export const getPlayerBalance = state => fromPlayer.getPlayerBalance(state.player)

// UI selectors.
export const isBasicStrategyOpen = state => fromUi.isBasicStrategyOpen(state.ui)
export const isCardCounterOpen = state => fromUi.isCardCounterOpen(state.ui)
export const isMobileNavOpen = state => fromUi.isMobileNavOpen(state.ui)
