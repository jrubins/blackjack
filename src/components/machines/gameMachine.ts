import { assign, Machine } from 'xstate'
import _ from 'lodash'

import {
  Card,
  CountOption,
  Hand,
  HAND_RESULTS,
  PLAYER_DECISIONS,
} from '../../utils/types'
import { canDouble, canSplit } from '../../utils/rules'
import { checkBasicStrategy } from '../../utils/strategy'
import { customEvent, EVENT_NAMES } from '../../utils/analytics'
import { dealCard, makeDeck, sumCards } from '../../utils/cards'

enum ACTIONS {
  ADD_DEALER_CARD = 'ADD_DEALER_CARD',
  ADD_DEALER_CARD_TO_COUNT = 'ADD_DEALER_CARD_TO_COUNT',
  ADD_PLAYER_CARD = 'ADD_PLAYER_CARD',
  ADD_PLAYER_WINNINGS = 'ADD_PLAYER_WINNINGS',
  ADJUST_BET_FOR_BALANCE = 'ADJUST_BET_FOR_BALANCE',
  DEAL_CARDS = 'DEAL_CARDS',
  DEDUCT_BALANCE = 'DEDUCT_BALANCE',
  GO_TO_NEXT_PLAYER_HAND = 'GO_TO_NEXT_PLAYER_HAND',
  MARK_FIRST_BET_PLACED = 'MARK_FIRST_BET_PLACED',
  RESET_ACTIVE_HAND_INDEX = 'RESET_ACTIVE_HAND_INDEX',
  SPLIT_ACTIVE_HAND = 'SPLIT_ACTIVE_HAND',
  TRACK_BET_PLACED = 'TRACK_BET_PLACED',
  UPDATE_BASIC_STRATEGY = 'UPDATE_BASIC_STRATEGY',
  UPDATE_BET = 'UPDATE_BET',
  UPDATE_COUNT_GUESS = 'UPDATE_COUNT_GUESS',
  UPDATE_DECKS = 'UPDATE_DECKS',
}

export enum EVENTS {
  CHANGE_NUM_DECKS = 'CHANGE_NUM_DECKS',
  ENTER_BET = 'ENTER_BET',
  GUESS_COUNT = 'GUESS_COUNT',
  PLACE_BET = 'PLACE_BET',
  PLAYER_DOUBLE = 'PLAYER_DOUBLE',
  PLAYER_HIT = 'PLAYER_HIT',
  PLAYER_SPLIT = 'PLAYER_SPLIT',
  PLAYER_STAND = 'PLAYER_STAND',
}

const EVENTS_TO_PLAYER_DECISIONS = {
  [EVENTS.PLAYER_DOUBLE]: PLAYER_DECISIONS.DOUBLE,
  [EVENTS.PLAYER_HIT]: PLAYER_DECISIONS.HIT,
  [EVENTS.PLAYER_SPLIT]: PLAYER_DECISIONS.SPLIT,
  [EVENTS.PLAYER_STAND]: PLAYER_DECISIONS.STAND,
}

enum GUARDS {
  ALL_HANDS_BUST = 'ALL_HANDS_BUST',
  CAN_DOUBLE_ACTIVE_HAND = 'CAN_DOUBLE_ACTIVE_HAND',
  CAN_SPLIT_ACTIVE_HAND = 'CAN_SPLIT_ACTIVE_HAND',
  CURRENT_HAND_DONE = 'CURRENT_HAND_DONE',
  DEALER_HAS_21 = 'DEALER_HAS_21',
  DEALER_NEEDS_MORE_CARDS = 'DEALER_NEEDS_MORE_CARDS',
  HAS_ENTERED_BET = 'HAS_ENTERED_BET',
  PLAYER_HAS_NO_MORE_HANDS = 'PLAYER_HAS_NO_MORE_HANDS',
}

export enum STATES {
  CHECKING_DONE_WITH_HAND = 'CHECKING_DONE_WITH_HAND',
  DEALER_TURN = 'DEALER_TURN',
  DEALING_CARDS = 'DEALING_CARDS',
  DONE_WITH_HAND = 'DONE_WITH_HAND',
  PLAYER_TURN = 'PLAYER_TURN',
  ROUND_OVER = 'ROUND_OVER',
  TAKING_BETS = 'TAKING_BETS',
}

export interface Context {
  // The user may have multiple hands if they've split a hand.
  activePlayerHandIndex: number
  basicStrategyError: string
  basicStrategyStreak: number
  count: number | null
  countGuess: number | null
  // A list of options for the user to choose from when guessing the count.
  countOptions: CountOption[]
  dealerCards: Card[]
  deck: Card[]
  // Represents the index of the next card in the deck to be dealt.
  deckIndex: number
  enteredBet: number | null
  numDecks: number
  playerBalance: number
  playerHands: Hand[]
  playerHasPlacedFirstBet: boolean
}

type ChangeNumDecks = { numDecks: number; type: EVENTS.CHANGE_NUM_DECKS }
type EnterBet = { bet: string; type: EVENTS.ENTER_BET }
type GuessCount = { countGuess: number; type: EVENTS.GUESS_COUNT }
type PlaceBet = { type: EVENTS.PLACE_BET }
type PlayerDouble = { type: EVENTS.PLAYER_DOUBLE }
type PlayerHit = { type: EVENTS.PLAYER_HIT }
type PlayerSplit = { type: EVENTS.PLAYER_SPLIT }
type PlayerStand = { type: EVENTS.PLAYER_STAND }
export type Events =
  | ChangeNumDecks
  | EnterBet
  | GuessCount
  | PlaceBet
  | PlayerDouble
  | PlayerHit
  | PlayerSplit
  | PlayerStand

/**
 * Returns count options with the true count option and alternative (incorrect) options.
 */
function getCountOptions(trueCount: number | null): CountOption[] {
  if (trueCount === null) {
    return []
  }

  // Choose random increments for the count between 1-4.
  const countIncrement1 = _.random(1, 4)
  let countIncrement2 = _.random(1, 4)

  // Make sure our count alternative increments are not the same value.
  if (countIncrement2 === countIncrement1) {
    countIncrement2 += 1
  }

  console.info('Count increments:', `${countIncrement1}`, `${countIncrement2}`)

  // Randomly choose whether to add or subtract the random values to the true count.
  const countAlternative1 =
    _.random(0, 1) === 1
      ? trueCount + countIncrement1
      : trueCount - countIncrement1
  const countAlternative2 =
    _.random(0, 1) === 1
      ? trueCount + countIncrement2
      : trueCount - countIncrement2

  console.info('True count value:', `${trueCount}`)
  console.info(
    'Count alternative values:',
    `${countAlternative1}`,
    `${countAlternative2}`
  )

  return _.sortBy(
    [
      {
        label: `${trueCount}`,
        value: trueCount,
      },
      {
        label: `${countAlternative1}`,
        value: countAlternative1,
      },
      {
        label: `${countAlternative2}`,
        value: countAlternative2,
      },
    ],
    'value'
  )
}

/**
 * Returns the state for player hands after adding a new card to the active hand.
 */
function getNewCardPlayerHandState({
  activePlayerHandIndex,
  isDouble = false,
  newCard,
  playerHands,
}: {
  activePlayerHandIndex: number
  isDouble?: boolean
  newCard: Card
  playerHands: Hand[]
}): Hand[] {
  const newPlayerHands = [...playerHands]
  const activePlayerHandBet = newPlayerHands[activePlayerHandIndex].bet || 0

  // Add the new card to the active player hand.
  newPlayerHands[activePlayerHandIndex] = {
    bet: isDouble ? activePlayerHandBet * 2 : activePlayerHandBet,
    cards: [...newPlayerHands[activePlayerHandIndex].cards, newCard],
    result: newPlayerHands[activePlayerHandIndex].result,
  }

  return newPlayerHands
}

/**
 * Deals a new card and adjusts the count appropriately.
 */
function getNewCardWithCount({
  count,
  deck,
  deckIndex,
}: {
  count: number | null
  deck: Card[]
  deckIndex: number
}): {
  card: Card
  count: number
  countGuess: null
  countOptions: CountOption[]
  deck: Card[]
  deckIndex: number
} {
  const nextCardResult = dealCard({ deck, deckIndex })
  const nextCard = nextCardResult.card
  const newCount = getNewCountValue(count, nextCard.number)

  return {
    card: nextCard,
    count: newCount,
    countGuess: null,
    countOptions: getCountOptions(newCount),
    deck: nextCardResult.deck,
    deckIndex: nextCardResult.deckIndex,
  }
}

/**
 * Gets the new count value given the current count and the new card value.
 */
function getNewCountValue(
  currentCount: number | null,
  cardValue: number
): number {
  let countAdjustment = 0

  if (cardValue >= 10 || cardValue === 1) {
    // 10-Ace.
    countAdjustment = -1
  } else if (cardValue > 1 && cardValue < 7) {
    // 2-6.
    countAdjustment = 1
  }

  return (_.isNil(currentCount) ? 0 : currentCount) + countAdjustment
}

function getResolvedBet({
  bet,
  playerBalance,
}: {
  bet: number | null
  playerBalance: number
}): number {
  // If the value couldn't be parsed, don't use it.
  let resolvedBet = Number.isNaN(bet) || bet === null ? 0 : bet

  // Don't let the bet be less than zero.
  resolvedBet = Math.max(resolvedBet, 0)

  // Don't let the bet be more than the player's remaining balance.
  resolvedBet = Math.min(resolvedBet, playerBalance)

  return resolvedBet
}

export const gameMachine = Machine<Context, Events>(
  {
    context: {
      activePlayerHandIndex: 0,
      basicStrategyError: '',
      basicStrategyStreak: 0,
      count: null,
      countGuess: null,
      countOptions: [],
      dealerCards: [],
      deck: makeDeck(1),
      deckIndex: 0,
      enteredBet: null,
      numDecks: 1,
      playerBalance: 2000,
      playerHands: [
        {
          // Need this field since the bet may change during the round (double, split, etc.).
          bet: null,
          cards: [],
          result: null,
        },
      ],
      playerHasPlacedFirstBet: false,
    },
    initial: STATES.TAKING_BETS,
    states: {
      [STATES.TAKING_BETS]: {
        on: {
          [EVENTS.CHANGE_NUM_DECKS]: {
            actions: [ACTIONS.UPDATE_DECKS],
          },
          [EVENTS.ENTER_BET]: {
            actions: [ACTIONS.UPDATE_BET],
          },
          [EVENTS.PLACE_BET]: {
            actions: [
              ACTIONS.DEDUCT_BALANCE,
              ACTIONS.MARK_FIRST_BET_PLACED,
              ACTIONS.RESET_ACTIVE_HAND_INDEX,
            ],
            // Can't deal if the player hasn't entered a bet yet.
            cond: GUARDS.HAS_ENTERED_BET,
            target: STATES.DEALING_CARDS,
          },
        },
      },
      [STATES.DEALING_CARDS]: {
        entry: [ACTIONS.DEAL_CARDS],
        always: [
          {
            cond: GUARDS.DEALER_HAS_21,
            target: STATES.ROUND_OVER,
          },
          {
            target: STATES.PLAYER_TURN,
          },
        ],
      },
      [STATES.PLAYER_TURN]: {
        on: {
          [EVENTS.PLAYER_DOUBLE]: {
            actions: [
              ACTIONS.DEDUCT_BALANCE,
              ACTIONS.UPDATE_BASIC_STRATEGY,
              ACTIONS.ADD_PLAYER_CARD,
            ],
            cond: GUARDS.CAN_DOUBLE_ACTIVE_HAND,
            // Once you double, you're done with deciding anything else.
            target: STATES.DONE_WITH_HAND,
          },
          [EVENTS.PLAYER_HIT]: {
            actions: [ACTIONS.UPDATE_BASIC_STRATEGY, ACTIONS.ADD_PLAYER_CARD],
            target: STATES.CHECKING_DONE_WITH_HAND,
          },
          [EVENTS.PLAYER_SPLIT]: {
            actions: [
              ACTIONS.DEDUCT_BALANCE,
              ACTIONS.UPDATE_BASIC_STRATEGY,
              ACTIONS.SPLIT_ACTIVE_HAND,
            ],
            cond: GUARDS.CAN_SPLIT_ACTIVE_HAND,
          },
          [EVENTS.PLAYER_STAND]: {
            actions: [ACTIONS.UPDATE_BASIC_STRATEGY],
            target: STATES.DONE_WITH_HAND,
          },
        },
      },
      [STATES.CHECKING_DONE_WITH_HAND]: {
        always: [
          {
            cond: GUARDS.ALL_HANDS_BUST,
            target: STATES.ROUND_OVER,
          },
          {
            cond: GUARDS.CURRENT_HAND_DONE,
            target: STATES.DONE_WITH_HAND,
          },
          {
            target: STATES.PLAYER_TURN,
          },
        ],
      },
      [STATES.DONE_WITH_HAND]: {
        always: [
          {
            // The second dealer card was hidden during the player's turn. Now it's been revealed
            // so the user can add it to their mental count.
            actions: [ACTIONS.ADD_DEALER_CARD_TO_COUNT],
            cond: GUARDS.PLAYER_HAS_NO_MORE_HANDS,
            target: STATES.DEALER_TURN,
          },
          {
            actions: [ACTIONS.GO_TO_NEXT_PLAYER_HAND],
            target: STATES.PLAYER_TURN,
          },
        ],
      },
      [STATES.DEALER_TURN]: {
        entry: [ACTIONS.ADD_DEALER_CARD],
        always: [
          {
            cond: GUARDS.DEALER_NEEDS_MORE_CARDS,
            target: STATES.DEALER_TURN,
          },
          {
            target: STATES.ROUND_OVER,
          },
        ],
      },
      [STATES.ROUND_OVER]: {
        entry: [
          ACTIONS.ADD_PLAYER_WINNINGS,
          // We pre-fill in the player's bet so they can quickly start the next round. However,
          // if their previous bet was greater than their current balance, we want to adjust it
          // so it's not over their current balance.
          ACTIONS.ADJUST_BET_FOR_BALANCE,
        ],
        always: { target: STATES.TAKING_BETS },
      },
    },
    on: {
      [EVENTS.GUESS_COUNT]: {
        actions: [ACTIONS.UPDATE_COUNT_GUESS],
      },
    },
  },
  {
    actions: {
      [ACTIONS.ADD_DEALER_CARD]: assign((context) => {
        const { card, ...rest } = getNewCardWithCount(context)

        return { ...rest, dealerCards: [...context.dealerCards, card] }
      }),
      [ACTIONS.ADD_DEALER_CARD_TO_COUNT]: assign({
        count: (context) => {
          return getNewCountValue(context.count, context.dealerCards[1].number)
        },
      }),
      [ACTIONS.ADD_PLAYER_CARD]: assign((context, event) => {
        const { activePlayerHandIndex, playerHands } = context
        const { card, ...rest } = getNewCardWithCount(context)

        return {
          ...rest,
          playerHands: getNewCardPlayerHandState({
            activePlayerHandIndex,
            isDouble: event.type === EVENTS.PLAYER_DOUBLE,
            newCard: card,
            playerHands,
          }),
        }
      }),
      [ACTIONS.ADD_PLAYER_WINNINGS]: assign((context) => {
        const { dealerCards, playerBalance, playerHands } = context
        const dealerTotal = sumCards(dealerCards).high
        const newPlayerHands = [...playerHands]
        let playerWinnings = 0

        playerHands.forEach(({ bet, cards }, i) => {
          const handTotal = sumCards(cards).high
          const resolvedBet = bet || 0
          let handResult = HAND_RESULTS.LOST

          // Check to see if player got blackjack.
          if (handTotal === 21 && cards.length === 2) {
            playerWinnings += Math.round(resolvedBet + (resolvedBet * 3) / 2)
            handResult = HAND_RESULTS.WON
          } else if (
            handTotal <= 21 &&
            (handTotal > dealerTotal || dealerTotal > 21)
          ) {
            // Straight win or dealer bust.
            playerWinnings += resolvedBet * 2
            handResult = HAND_RESULTS.WON
          } else if (handTotal === dealerTotal) {
            // A push.
            playerWinnings += resolvedBet
            handResult = HAND_RESULTS.PUSH
          }

          newPlayerHands[i].result = handResult
        })

        return {
          playerBalance:
            playerWinnings === 0 && playerBalance === 0
              ? // Temporary reset of balance when you run out.
                2000
              : playerBalance + playerWinnings,
          playerHands: newPlayerHands,
        }
      }),
      [ACTIONS.ADJUST_BET_FOR_BALANCE]: assign({
        enteredBet: (context) => {
          return getResolvedBet({
            bet: context.enteredBet,
            playerBalance: context.playerBalance,
          })
        },
      }),
      [ACTIONS.DEAL_CARDS]: assign((context) => {
        let newCount = context.count
        let newCountOptions = context.countOptions
        let newDeckIndex = context.deckIndex
        let newDeck = [...context.deck]

        // Order here to mimic an actual deal at a casino.
        const dealerCards: Card[] = []
        const playerCards: Card[] = []
        for (let i = 0; i < 4; i++) {
          const newCardResult = getNewCardWithCount({
            count: newCount,
            deck: newDeck,
            deckIndex: newDeckIndex,
          })

          if (i === 0 || i === 2) {
            playerCards.push(newCardResult.card)
          } else {
            dealerCards.push(newCardResult.card)
          }

          // We adjust the count for every card except for the second dealer card which
          // is not yet revealed to the player.
          if (i !== 3) {
            newCount = newCardResult.count
            newCountOptions = newCardResult.countOptions
          }
          newDeck = newCardResult.deck
          newDeckIndex = newCardResult.deckIndex
        }

        return {
          count: newCount,
          countGuess: null,
          countOptions: newCountOptions,
          dealerCards,
          deck: newDeck,
          deckIndex: newDeckIndex,
          playerHands: [
            {
              bet: context.enteredBet,
              cards: playerCards,
              result: null,
            },
          ],
        }
      }),
      [ACTIONS.DEDUCT_BALANCE]: assign({
        playerBalance: (context) => {
          return context.playerBalance - (context.enteredBet || 0)
        },
      }),
      [ACTIONS.GO_TO_NEXT_PLAYER_HAND]: assign((context) => {
        const { activePlayerHandIndex, playerHands } = context
        const newActivePlayerHandIndex = activePlayerHandIndex + 1
        const newPlayerHands = [...playerHands]

        // The active hand could have less than two cards if we're moving on to the second hand
        // after a split.
        if (newPlayerHands[newActivePlayerHandIndex].cards.length < 2) {
          const { card, ...rest } = getNewCardWithCount(context)

          return {
            ...rest,
            activePlayerHandIndex: newActivePlayerHandIndex,
            countGuess: null,
            playerHands: getNewCardPlayerHandState({
              activePlayerHandIndex: newActivePlayerHandIndex,
              isDouble: false,
              newCard: card,
              playerHands,
            }),
          }
        }

        return {
          activePlayerHandIndex: newActivePlayerHandIndex,
        }
      }),
      [ACTIONS.MARK_FIRST_BET_PLACED]: assign<Context>({
        playerHasPlacedFirstBet: true,
      }),
      [ACTIONS.RESET_ACTIVE_HAND_INDEX]: assign<Context>({
        activePlayerHandIndex: 0,
      }),
      [ACTIONS.SPLIT_ACTIVE_HAND]: assign((context) => {
        const { activePlayerHandIndex, enteredBet, playerHands } = context
        const newPlayerHands = [...playerHands]
        const activePlayerHand = playerHands[activePlayerHandIndex]
        const { card, ...rest } = getNewCardWithCount(context)

        // Remove the current active hand and insert the split hands in its place.
        newPlayerHands.splice(
          activePlayerHandIndex,
          1,
          {
            bet: enteredBet,
            cards: [activePlayerHand.cards[0], card],
            result: activePlayerHand.result,
          },
          {
            bet: enteredBet,
            cards: [activePlayerHand.cards[1]],
            result: activePlayerHand.result,
          }
        )

        return {
          ...rest,
          playerHands: newPlayerHands,
        }
      }),
      [ACTIONS.TRACK_BET_PLACED]: (context) => {
        customEvent(EVENT_NAMES.SET_BET(context.enteredBet || 0))
      },
      [ACTIONS.UPDATE_BASIC_STRATEGY]: assign((context, event) => {
        const {
          activePlayerHandIndex,
          basicStrategyStreak,
          dealerCards,
          enteredBet,
          playerBalance,
          playerHands,
        } = context
        const resolvedBet = enteredBet || 0

        const basicStrategyResult = checkBasicStrategy({
          playerCards: playerHands[activePlayerHandIndex].cards,
          dealerUpCardValue: dealerCards[0].number,
          playerAction: EVENTS_TO_PLAYER_DECISIONS[event.type],
          hasEnoughToDouble: playerBalance >= resolvedBet,
          hasEnoughToSplit: playerBalance >= resolvedBet,
        })

        return {
          basicStrategyStreak: basicStrategyResult.correct
            ? basicStrategyStreak + 1
            : 0,
          basicStrategyError: basicStrategyResult.correct
            ? ''
            : basicStrategyResult.error,
        }
      }),
      [ACTIONS.UPDATE_BET]: assign<Context>({
        enteredBet: (context, event: EnterBet) => {
          return getResolvedBet({
            bet: Number(event.bet),
            playerBalance: context.playerBalance,
          })
        },
      }),
      [ACTIONS.UPDATE_COUNT_GUESS]: assign<Context>({
        countGuess: (_context, event: GuessCount) => {
          return event.countGuess
        },
      }),
      [ACTIONS.UPDATE_DECKS]: assign<Context>(
        (_context, event: ChangeNumDecks) => {
          const { numDecks } = event

          return {
            deck: makeDeck(numDecks),
            deckIndex: 0,
            numDecks,
          }
        }
      ),
    },
    guards: {
      [GUARDS.ALL_HANDS_BUST]: (context) => {
        return _.every(
          context.playerHands,
          (playerHand) => sumCards(playerHand.cards).low > 21
        )
      },
      [GUARDS.CAN_DOUBLE_ACTIVE_HAND]: (context) => {
        const {
          activePlayerHandIndex,
          enteredBet,
          playerBalance,
          playerHands,
        } = context
        const activePlayerHand = playerHands[activePlayerHandIndex]

        return canDouble({
          balance: playerBalance,
          bet: enteredBet || 0,
          cards: activePlayerHand.cards,
        })
      },
      [GUARDS.CAN_SPLIT_ACTIVE_HAND]: (context) => {
        const {
          activePlayerHandIndex,
          enteredBet,
          playerBalance,
          playerHands,
        } = context
        const activePlayerHand = playerHands[activePlayerHandIndex]

        return canSplit({
          balance: playerBalance,
          bet: enteredBet || 0,
          cards: activePlayerHand.cards,
        })
      },
      [GUARDS.CURRENT_HAND_DONE]: (context) => {
        return (
          sumCards(context.playerHands[context.activePlayerHandIndex].cards)
            .high >= 21
        )
      },
      [GUARDS.DEALER_HAS_21]: (context) => {
        return sumCards(context.dealerCards).high >= 21
      },
      [GUARDS.DEALER_NEEDS_MORE_CARDS]: (context) => {
        return sumCards(context.dealerCards).high < 17
      },
      [GUARDS.HAS_ENTERED_BET]: (context) => {
        return (context.enteredBet || 0) > 0
      },
      [GUARDS.PLAYER_HAS_NO_MORE_HANDS]: (context) => {
        return context.activePlayerHandIndex === context.playerHands.length - 1
      },
    },
  }
)
