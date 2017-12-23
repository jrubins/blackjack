/**
 * The different types of decisions a player can make during a hand.
 *
 * @type {Object}
 */
export const PLAYER_DECISIONS = {
  DOUBLE: 'double',
  HIT: 'hit',
  SPLIT: 'split',
  STAND: 'stand',
}

/**
 * The different types of result for a player's hand.
 *
 * @type {Object}
 */
export const HAND_RESULTS = {
  LOST: 'lost',
  PUSH: 'push',
  WON: 'won',
}
