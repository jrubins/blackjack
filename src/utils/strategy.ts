import _ from 'lodash'

import { Card, PLAYER_DECISIONS, Strategy } from './types'
import { sumCards } from './cards'

/**
 * The basic strategy chart for a player's hard totals.
 */
const HARD_STRATEGY: Strategy[] = [
  {
    action: PLAYER_DECISIONS.HIT,
    error: 'Always hit 5-8.',
    player: [5, 6, 7, 8],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    player: [9],
    error: "Hit on 9. Double when dealer shows 3-6 (hit if can't).",
    exceptions: [
      {
        action: PLAYER_DECISIONS.DOUBLE,
        dealer: [3, 4, 5, 6],
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
  },
  {
    action: PLAYER_DECISIONS.DOUBLE,
    player: [10],
    error: "Double on 10 (hit if can't). Hit when dealer shows 10 or Ace.",
    exceptions: [
      {
        action: PLAYER_DECISIONS.HIT,
        dealer: [10, 1],
      },
    ],
    noDoubleAction: PLAYER_DECISIONS.HIT,
  },
  {
    action: PLAYER_DECISIONS.DOUBLE,
    error: "Always double on 11. Hit if can't double.",
    noDoubleAction: PLAYER_DECISIONS.HIT,
    player: [11],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error: 'Hit on 12. Stand when dealer shows 4, 5 or 6.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.STAND,
        dealer: [4, 5, 6],
      },
    ],
    player: [12],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error: 'Hit on 13-16. Stand when dealer shows 2-6.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.STAND,
        dealer: [2, 3, 4, 5, 6],
      },
    ],
    player: [13, 14, 15, 16],
  },
  {
    action: PLAYER_DECISIONS.STAND,
    error: 'Always stand on 17-21.',
    player: [17, 18, 19, 20, 21],
  },
]

/**
 * The basic strategy chart for a player's soft totals (hand contains an ace).
 */
const SOFT_STRATEGY = [
  {
    action: PLAYER_DECISIONS.HIT,
    player: [13, 14],
    error:
      "Hit on soft 13 or 14. Double when dealer shows 5 or 6 (hit if can't).",
    exceptions: [
      {
        action: PLAYER_DECISIONS.DOUBLE,
        dealer: [5, 6],
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error:
      "Hit on soft 15 or 16. Double when dealer shows 4, 5 or 6 (hit if can't).",
    exceptions: [
      {
        action: PLAYER_DECISIONS.DOUBLE,
        dealer: [4, 5, 6],
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],

    player: [15, 16],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error: "Hit on soft 17. Double when dealer shows 3-6 (hit if can't).",
    exceptions: [
      {
        action: PLAYER_DECISIONS.DOUBLE,
        dealer: [3, 4, 5, 6],
        noDoubleAction: PLAYER_DECISIONS.HIT,
      },
    ],
    player: [17],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error: "Hit on soft 18. Stand on 2, 7-8. Double on 3-6 (stand if can't).",
    exceptions: [
      {
        action: PLAYER_DECISIONS.DOUBLE,
        dealer: [3, 4, 5, 6],
        noDoubleAction: PLAYER_DECISIONS.STAND,
      },
      {
        action: PLAYER_DECISIONS.STAND,
        dealer: [2, 7, 8],
      },
    ],
    player: [18],
  },
  {
    action: PLAYER_DECISIONS.STAND,
    error: 'Always stand on soft 19-21.',
    player: [19, 20, 21],
  },
]

/**
 * The basic strategy chart for when a player can split.
 */
const SPLIT_STRATEGY = [
  {
    action: PLAYER_DECISIONS.SPLIT,
    error: 'Split with 2s. Hit when dealer shows 8-Ace.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.HIT,
        dealer: [8, 9, 10, 1],
      },
    ],
    player: [2, 3, 7],
  },
  {
    action: PLAYER_DECISIONS.HIT,
    error: 'Hit with 4s. Split when dealer show 5 or 6.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.SPLIT,
        dealer: [5, 6],
      },
    ],
    player: [4],
  },
  {
    action: PLAYER_DECISIONS.SPLIT,
    error: 'Split with 6s. Hit when dealer shows 7-Ace.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.HIT,
        dealer: [7, 8, 9, 10, 1],
      },
    ],
    player: [6],
  },
  {
    action: PLAYER_DECISIONS.SPLIT,
    error: 'Always split 8s or Aces.',
    player: [8, 1],
  },
  {
    action: PLAYER_DECISIONS.SPLIT,
    error: 'Split with 9s. Stand when dealer shows 7, 10 or Ace.',
    exceptions: [
      {
        action: PLAYER_DECISIONS.STAND,
        dealer: [7, 10, 1],
      },
    ],
    player: [9],
  },
]

/**
 * Checks a player action against the basic strategy chart given the dealer's up card.
 */
export function checkBasicStrategy({
  playerCards,
  dealerUpCardValue,
  playerAction,
  hasEnoughToDouble,
  hasEnoughToSplit,
}: {
  playerCards: Card[]
  dealerUpCardValue: number
  playerAction: PLAYER_DECISIONS
  hasEnoughToDouble: boolean
  hasEnoughToSplit: boolean
}): { correct: boolean; error: string } {
  // Have to adjust dealer up card to make J, Q and K values worth 10.
  const adjustedDealerUpCardValue = Math.min(dealerUpCardValue, 10)
  const playerTotal = sumCards(playerCards)
  let strategy: Strategy | undefined

  // Check if we should be splitting.
  if (
    playerCards.length === 2 &&
    playerCards[0].number === playerCards[1].number &&
    hasEnoughToSplit
  ) {
    console.info('Using split basic strategy chart...')

    strategy = _.find(SPLIT_STRATEGY, ({ player }) =>
      _.includes(player, playerCards[0].number)
    )
  }

  // See if we shouldn't split or couldn't find a strategy for splitting with the player cards.
  if (!strategy) {
    let strategyTable = HARD_STRATEGY

    // If the totals do not equal each other, there's an Ace in the player hand.
    if (playerTotal.low !== playerTotal.high) {
      console.info('Using soft total basic strategy chart...')
      strategyTable = SOFT_STRATEGY
    } else {
      console.info('Using hard total basic strategy chart...')
    }

    strategy = _.find(strategyTable, ({ player }) =>
      _.includes(player, playerTotal.high)
    )
  }

  if (strategy) {
    console.info('Found strategy:', strategy)

    // See if this strategy has exceptions and the dealer up card qualifies to use an exception.
    const exception =
      strategy.exceptions &&
      _.find(strategy.exceptions, ({ dealer }) =>
        _.includes(dealer, adjustedDealerUpCardValue)
      )

    console.info('Strategy exception applies:', exception)

    let correctAction: PLAYER_DECISIONS | undefined = exception
      ? exception.action
      : strategy.action

    // The user can't double if they have more than two cards or in some other scenarios (not
    // enough money to double).
    if (
      correctAction === PLAYER_DECISIONS.DOUBLE &&
      (playerCards.length > 2 || !hasEnoughToDouble)
    ) {
      console.info(
        'Player cannot double, suggesting hit. Num cards:',
        playerCards.length,
        'Enough to double:',
        hasEnoughToDouble
      )

      correctAction = exception
        ? exception.noDoubleAction
        : strategy.noDoubleAction
    }

    return {
      correct: playerAction === correctAction,
      error: strategy.error,
    }
  }

  console.info(
    'No strategy found for cards:',
    playerCards,
    adjustedDealerUpCardValue,
    playerAction
  )

  return { correct: true, error: '' }
}
