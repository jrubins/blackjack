import {
  EVENT_NAMES,
  customEvent,
} from '../../utils/analytics';

import {
  BASIC_STRATEGY_CLOSE,
  BASIC_STRATEGY_OPEN,
  CARD_COUNTER_CLOSE,
  CARD_COUNTER_OPEN,
  MOBILE_NAV_CLOSE,
  MOBILE_NAV_OPEN,
} from '../';

/**
 * Turns off the basic strategy advisor.
 *
 * @returns {Object}
 */
export function closeBasicStrategy() {
  customEvent(EVENT_NAMES.BASIC_STRATEGY_OFF);

  return {
    type: BASIC_STRATEGY_CLOSE,
  };
}

/**
 * Turns off the card counter advisor.
 *
 * @returns {Object}
 */
export function closeCardCounter() {
  return {
    type: CARD_COUNTER_CLOSE,
  };
}

/**
 * Closes the mobile navigation menu.
 *
 * @returns {Object}
 */
export function closeMobileNav() {
  customEvent(EVENT_NAMES.MOBILE_NAV_CLOSE);

  return {
    type: MOBILE_NAV_CLOSE,
  };
}

/**
 * Turns on the basic strategy advisor.
 *
 * @returns {Object}
 */
export function openBasicStrategy() {
  customEvent(EVENT_NAMES.BASIC_STRATEGY_ON);

  return {
    type: BASIC_STRATEGY_OPEN,
  };
}

/**
 * Turns on the card counter advisor.
 *
 * @returns {Object}
 */
export function openCardCounter() {
  return {
    type: CARD_COUNTER_OPEN,
  };
}

/**
 * Opens the mobile navigation menu.
 *
 * @returns {Object}
 */
export function openMobileNav() {
  customEvent(EVENT_NAMES.MOBILE_NAV_OPEN);

  return {
    type: MOBILE_NAV_OPEN,
  };
}
