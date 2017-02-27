import {
  BASIC_STRATEGY_CLOSE,
  BASIC_STRATEGY_OPEN,
  MOBILE_NAV_CLOSE,
  MOBILE_NAV_OPEN,
} from '../';

/**
 * Turns off the basic strategy advisor.
 *
 * @returns {Object}
 */
export function closeBasicStrategy() {
  return {
    type: BASIC_STRATEGY_CLOSE,
  };
}

/**
 * Closes the mobile navigation menu.
 *
 * @returns {Object}
 */
export function closeMobileNav() {
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
  return {
    type: BASIC_STRATEGY_OPEN,
  };
}

/**
 * Opens the mobile navigation menu.
 *
 * @returns {Object}
 */
export function openMobileNav() {
  return {
    type: MOBILE_NAV_OPEN,
  };
}
