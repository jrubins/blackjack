import { hot } from 'react-hot-loader/root'
import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useMachine } from '@xstate/react'

import { getConfigValue } from '../utils/config'
import { getNumCardsRemainingInDeck } from '../utils/cards'

import {
  Context,
  EVENTS,
  Events,
  gameMachine,
  STATES,
} from './machines/gameMachine'
import { EVENT_NAMES, track, useSegmentTracking } from '../hooks/analytics'
import { useConfigSync } from '../hooks/config'
import { useDeferredEffect } from '../hooks/general'
import Header from './Header'
import HomePage from './pages/HomePage'

const App: React.FC = () => {
  useSegmentTracking()

  const [isBasicStrategyOpen, setIsBasicStrategyOpen] = useState(
    getConfigValue('isBasicStrategyOpen', true)
  )
  const [isCardCounterOpen, setIsCardCounterOpen] = useState(
    getConfigValue('isCardCounterOpen', true)
  )
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useDeferredEffect(() => {
    track(
      isBasicStrategyOpen
        ? EVENT_NAMES.BASIC_STRATEGY_ON
        : EVENT_NAMES.BASIC_STRATEGY_OFF
    )
  }, [isBasicStrategyOpen])

  useDeferredEffect(() => {
    track(
      isMobileNavOpen
        ? EVENT_NAMES.MOBILE_NAV_OPEN
        : EVENT_NAMES.MOBILE_NAV_CLOSE
    )
  }, [isMobileNavOpen])

  const [gameState, gameSend] = useMachine<Context, Events>(gameMachine, {
    devTools: true,
  })
  const {
    activePlayerHandIndex,
    basicStrategyError,
    basicStrategyStreak,
    count,
    countGuess,
    countOptions,
    dealerCards,
    deck,
    deckIndex,
    enteredBet,
    numDecks,
    playerBalance,
    playerHands,
    playerHasPlacedFirstBet,
  } = gameState.context
  const numRemainingCards = getNumCardsRemainingInDeck({ deck, deckIndex })
  const isPlayerTurn = gameState.matches(STATES.PLAYER_TURN)
  const isTakingBets = gameState.matches(STATES.TAKING_BETS)

  useConfigSync({
    balance: playerBalance,
    isBasicStrategyOpen,
    isCardCounterOpen,
    numDecks,
  })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const adjustedKey = event.key.toLowerCase()

      if (isPlayerTurn) {
        if (adjustedKey === 'd') {
          gameSend({ type: EVENTS.PLAYER_DOUBLE })
        } else if (adjustedKey === 'h') {
          gameSend({ type: EVENTS.PLAYER_HIT })
        } else if (adjustedKey === 's') {
          gameSend({ type: EVENTS.PLAYER_STAND })
        } else if (adjustedKey === 'p') {
          gameSend({ type: EVENTS.PLAYER_SPLIT })
        }
      } else {
        if (adjustedKey === 'd' || adjustedKey === 'enter') {
          gameSend({ type: EVENTS.PLACE_BET })
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isPlayerTurn, gameSend])

  return (
    <>
      <Header
        isBasicStrategyOpen={isBasicStrategyOpen}
        isCardCounterOpen={isCardCounterOpen}
        isMobileNavOpen={isMobileNavOpen}
        numDecks={numDecks}
        onNumDecksChanged={(numDecks) => {
          gameSend({ numDecks, type: EVENTS.CHANGE_NUM_DECKS })
        }}
        onToggleBasicStrategy={() => {
          setIsBasicStrategyOpen((isOpen) => !isOpen)
        }}
        onToggleCardCounter={() => {
          setIsCardCounterOpen((isOpen) => !isOpen)
        }}
        onToggleMobileNav={() => {
          setIsMobileNavOpen((isOpen) => !isOpen)
        }}
        playerBalance={playerBalance}
      />

      <Switch>
        <Route exact={true} path="/">
          <HomePage
            activePlayerHandIndex={activePlayerHandIndex}
            basicStrategyError={basicStrategyError}
            basicStrategyStreak={basicStrategyStreak}
            cardCounterOpen={isCardCounterOpen}
            closeBasicStrategy={() => {
              setIsBasicStrategyOpen(false)
            }}
            closeCardCounter={() => {
              setIsCardCounterOpen(false)
            }}
            count={count}
            countGuess={countGuess}
            countOptions={countOptions}
            dealerCards={dealerCards}
            enteredBet={enteredBet}
            isBasicStrategyOpen={isBasicStrategyOpen}
            isPlayerTurn={isPlayerTurn}
            isTakingBets={isTakingBets}
            numDecks={numDecks}
            numRemainingCards={numRemainingCards}
            onChangeBet={(bet) => {
              gameSend({ bet, type: EVENTS.ENTER_BET })
            }}
            onClickDeal={() => {
              gameSend({ type: EVENTS.PLACE_BET })
            }}
            onCountGuess={(countGuess) => {
              gameSend({ countGuess, type: EVENTS.GUESS_COUNT })
            }}
            onDouble={() => {
              gameSend({ type: EVENTS.PLAYER_DOUBLE })
            }}
            onHit={() => {
              gameSend({ type: EVENTS.PLAYER_HIT })
            }}
            onSplit={() => {
              gameSend({ type: EVENTS.PLAYER_SPLIT })
            }}
            onStand={() => {
              gameSend({ type: EVENTS.PLAYER_STAND })
            }}
            playerBalance={playerBalance}
            playerHands={playerHands}
            playerHasPlacedFirstBet={playerHasPlacedFirstBet}
          />
        </Route>
      </Switch>
    </>
  )
}

export default hot(App)
