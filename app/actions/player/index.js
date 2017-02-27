import {
  DEDUCT_BALANCE,
  PLAYER_LOST,
  PLAYER_WON,
} from '../';

/**
 * Deducts an amount from the player's balance.
 *
 * @param {Number} amount
 * @returns {Object}
 */
export function deductBalance(amount) {
  return {
    type: DEDUCT_BALANCE,
    amount,
  };
}

/**
 * Indicates the player has lost a round.
 *
 * @returns {Object}
 */
export function playerLost() {
  return {
    type: PLAYER_LOST,
  };
}

/**
 * Indicates the player has won a round.
 *
 * @param {Number} amount
 * @returns {Object}
 */
export function playerWon(amount) {
  return {
    type: PLAYER_WON,
    amount,
  };
}
