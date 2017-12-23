import _ from 'lodash'

import { PLAYER_DECISIONS } from '../constants'
import { debug } from '../logs'
import { sumCards } from '../cards'

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
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Hit on 9. Double when dealer shows 3-6 (hit if can\'t).',
  },
  {
    player: [10],
    action: PLAYER_DECISIONS.DOUBLE,
    noDoubleAction: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [10, 1],
        action: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Double on 10 (hit if can\'t). Hit when dealer shows 10 or Ace.',
  },
  {
    player: [11],
    action: PLAYER_DECISIONS.DOUBLE,
    noDoubleAction: PLAYER_DECISIONS.HIT,
    error: 'Always double on 11. Hit if can\'t double.',
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
]

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
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Hit on soft 13 or 14. Double when dealer shows 5 or 6 (hit if can\'t).',
  },
  {
    player: [15, 16],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Hit on soft 15 or 16. Double when dealer shows 4, 5 or 6 (hit if can\'t).',
  },
  {
    player: [17],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [3, 4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Hit on soft 17. Double when dealer shows 3-6 (hit if can\'t).',
  },
  {
    player: [18],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [3, 4, 5, 6],
        action: PLAYER_DECISIONS.DOUBLE,
        noDoubleAction: PLAYER_DECISIONS.STAND,
      },
      {
        dealer: [2, 7, 8],
        action: PLAYER_DECISIONS.STAND,
      },
    ],
    error: 'Hit on soft 18. Stand on 2, 7-8. Double on 3-6 (stand if can\'t).',
  },
  {
    player: [19, 20, 21],
    action: PLAYER_DECISIONS.STAND,
    error: 'Always stand on soft 19-21.',
  },
]

/**
 * The basic strategy chart for when a player can split.
 *
 * @type {Array<Object>}
 */
const SPLIT_STRATEGY = [
  {
    player: [2, 3, 7],
    action: PLAYER_DECISIONS.SPLIT,
    exceptions: [
      {
        dealer: [8, 9, 10, 1],
        action: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Split with 2s. Hit when dealer shows 8-Ace.',
  },
  {
    player: [4],
    action: PLAYER_DECISIONS.HIT,
    exceptions: [
      {
        dealer: [5, 6],
        action: PLAYER_DECISIONS.SPLIT,
      },
    ],
    error: 'Hit with 4s. Split when dealer show 5 or 6.',
  },
  {
    player: [6],
    action: PLAYER_DECISIONS.SPLIT,
    exceptions: [
      {
        dealer: [7, 8, 9, 10, 1],
        action: PLAYER_DECISIONS.HIT,
      },
    ],
    error: 'Split with 6s. Hit when dealer shows 7-Ace.',
  },
  {
    player: [8, 1],
    action: PLAYER_DECISIONS.SPLIT,
    error: 'Always split 8s or Aces.',
  },
  {
    player: [9],
    action: PLAYER_DECISIONS.SPLIT,
    exceptions: [
      {
        dealer: [7, 10, 1],
        action: PLAYER_DECISIONS.STAND,
      },
    ],
    error: 'Split with 9s. Stand when dealer shows 7, 10 or Ace.',
  },
]

/**
 * Checks a player action against the basic strategy chart given the dealer's up card.
 *
 * @param {Object} opts
 * @param {Array} opts.playerCards
 * @param {Number} opts.dealerUpCardValue
 * @param {String} opts.playerAction
 * @param {Boolean} opts.hasEnoughToDouble
 * @param {Boolean} opts.hasEnoughToSplit
 * @returns {Object}
 */
export function checkBasicStrategy({
  playerCards,
  dealerUpCardValue,
  playerAction,
  hasEnoughToDouble,
  hasEnoughToSplit,
}) {
  // Have to adjust dealer up card to make J, Q and K values worth 10.
  const adjustedDealerUpCardValue = Math.min(dealerUpCardValue, 10)
  const playerTotal = sumCards(playerCards)
  let strategy

  // Check if we should be splitting.
  if (playerCards.length === 2 && playerCards[0].number === playerCards[1].number && hasEnoughToSplit) {
    debug('Using split basic strategy chart...')

    strategy = _.find(SPLIT_STRATEGY, ({ player }) => _.includes(player, playerCards[0].number))
  }

  // See if we shouldn't split or couldn't find a strategy for splitting with the player cards.
  if (!strategy) {
    let strategyTable = HARD_STRATEGY

    // If the totals do not equal each other, there's an Ace in the player hand.
    if (playerTotal.low !== playerTotal.high) {
      debug('Using soft total basic strategy chart...')
      strategyTable = SOFT_STRATEGY
    } else {
      debug('Using hard total basic strategy chart...')
    }

    strategy = _.find(strategyTable, ({ player }) => _.includes(player, playerTotal.high))
  }

  if (strategy) {
    debug('Found strategy:', strategy)

    // See if this strategy has exceptions and the dealer up card qualifies to use an exception.
    const exception = strategy.exceptions && _.find(strategy.exceptions, ({ dealer }) => _.includes(dealer, adjustedDealerUpCardValue))

    debug('Strategy exception applies:', exception)

    let correctAction = exception ? exception.action : strategy.action

    // The user can't double if they have more than two cards or in some other scenarios (not
    // enough money to double).
    if (correctAction === PLAYER_DECISIONS.DOUBLE && (playerCards.length > 2 || !hasEnoughToDouble)) {
      debug('Player cannot double, suggesting hit. Num cards:', playerCards.length, 'Enough to double:', hasEnoughToDouble)

      correctAction = exception ? exception.noDoubleAction : strategy.noDoubleAction
    }

    return {
      correct: playerAction === correctAction,
      error: strategy.error,
    }
  }

  debug('No strategy found for cards:', playerCards, adjustedDealerUpCardValue, playerAction)
}
