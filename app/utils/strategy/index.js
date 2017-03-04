import _ from 'lodash';

import { PLAYER_DECISIONS } from '../constants';
import { debug } from '../logs';
import { sumCards } from '../cards';

/**
 * The basic strategy chart for a player's hard totals.
 *
 * @type {Array<Object>}
 */
const HARD_STRATEGY = [
  {
    player: [5, 6, 7, 8],
    action: PLAYER_DECISIONS.HIT,
    error: 'Always hit 5-8.',
  },
  {
    player: [9],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [3, 4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
      },
    ],
    error: 'Hit on 9. Double when dealer shows 3-6.',
  },
  {
    player: [10],
    action: PLAYER_DECISIONS.DOUBLE,
    exceptions: [
      {
        dealer: [10, 1],
        action: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Double on 10. Hit when dealer shows 10 or Ace.',
  },
  {
    player: [11],
    action: PLAYER_DECISIONS.DOUBLE,
    error: 'Always double on 11.',
  },
  {
    player: [12],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [4, 5, 6],
        action: PLAYER_DECISIONS.STAND,
      },
    ],
    error: 'Hit on 12. Stand when dealer shows 4, 5 or 6.',
  },
  {
    player: [13, 14, 15, 16],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [2, 3, 4, 5, 6],
        action: PLAYER_DECISIONS.STAND,
      },
    ],
    error: 'Hit on 13-16. Stand when dealer shows 2-6.',
  },
  {
    player: [17, 18, 19, 20, 21],
    action: PLAYER_DECISIONS.STAND,
    error: 'Always stand on 17-21.',
  },
];

/**
 * The basic strategy chart for a player's soft totals (hand contains an ace).
 *
 * @type {Array<Object>}
 */
const SOFT_STRATEGY = [
  {
    player: [13, 14],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
      },
    ],
    error: 'Hit on soft 13 or 14. Double when dealer shows 5 or 6.',
  },
  {
    player: [15, 16],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
      },
    ],
    error: 'Hit on soft 15 or 16. Double when dealer shows 4, 5 or 6.',
  },
  {
    player: [17],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [3, 4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
      },
    ],
    error: 'Hit on soft 17. Double when dealer shows 3-6.',
  },
  {
    player: [18],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [3, 4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
      },
      {
        dealer: [2, 7, 8],
        action: PLAYER_DECISIONS.STAND,
      },
    ],
    error: 'Hit on soft 18. Stand on 2, 7-8. Double on 3-6.',
  },
  {
    player: [19, 20, 21],
    action: PLAYER_DECISIONS.STAND,
    error: 'Always stand on soft 19-21.',
  },
];

/**
 * Checks a player action against the basic strategy chart given the dealer's up card.
 *
 * @param {Array} playerCards
 * @param {Number} dealerUpCardValue
 * @param {String} playerAction
 * @returns {Object}
 */
export function checkBasicStrategy(playerCards, dealerUpCardValue, playerAction) {
  const playerTotal = sumCards(playerCards);
  let strategyTable = HARD_STRATEGY;

  // If the totals do not equal each other, there's an Ace in the player hand.
  if (playerTotal.low !== playerTotal.high) {
    debug('Using soft basic strategy chart...');
    strategyTable = SOFT_STRATEGY;
  }

  const strategy = _.find(strategyTable, ({ player }) => _.includes(player, playerTotal.high));

  if (strategy) {
    debug('Found strategy:', strategy);

    // See if this strategy has exceptions and the dealer up card qualifies to use an exception.
    const exception = strategy.exceptions && _.find(strategy.exceptions, ({ dealer }) => _.includes(dealer, dealerUpCardValue));

    debug('Strategy exception applies:', exception);

    let correctAction = exception ? exception.action : strategy.action;

    // The user can't double if they have more than two cards or in some other scenarios (not
    // enough money to double).
    if (correctAction === PLAYER_DECISIONS.DOUBLE && playerCards.length > 2) {
      debug('Player cannot double, suggesting hit. Num cards:', playerCards.length);

      correctAction = PLAYER_DECISIONS.HIT;
    }

    return {
      correct: playerAction === correctAction,
      error: strategy.error,
    };
  }

  debug('No strategy found for cards:', playerCards, dealerUpCardValue, playerAction);
}
