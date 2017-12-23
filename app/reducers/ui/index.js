import { combineReducers } from 'redux'

import {
  BASIC_STRATEGY_CLOSE,
  BASIC_STRATEGY_OPEN,
  CARD_COUNTER_CLOSE,
  CARD_COUNTER_OPEN,
  MOBILE_NAV_CLOSE,
  MOBILE_NAV_OPEN,
} from '../../actions'

function basicStrategyOpen(state = true, action) {
  switch (action.type) {
    case BASIC_STRATEGY_CLOSE:
      return false

    case BASIC_STRATEGY_OPEN:
      return true

    default:
      return state
  }
}

function cardCounterOpen(state = true, action) {
  switch (action.type) {
    case CARD_COUNTER_CLOSE:
      return false

    case CARD_COUNTER_OPEN:
      return true

    default:
      return state
  }
}

function mobileNavOpen(state = false, action) {
  switch (action.type) {
    case MOBILE_NAV_CLOSE:
      return false

    case MOBILE_NAV_OPEN:
      return true

    default:
      return state
  }
}

export default combineReducers({
  basicStrategyOpen,
  cardCounterOpen,
  mobileNavOpen,
})

// Selectors.
export const isBasicStrategyOpen = state => state.basicStrategyOpen
export const isCardCounterOpen = state => state.cardCounterOpen
export const isMobileNavOpen = state => state.mobileNavOpen
