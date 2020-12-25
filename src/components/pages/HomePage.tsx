import React from 'react'

import { Card, CountOption, Hand as HandInterface } from '../../utils/types'
import { canDouble, canSplit } from '../../utils/rules'

import BasicStrategy from '../reusable/advice/BasicStrategy'
import Button from '../reusable/forms/Button'
import CardCounter from '../reusable/advice/CardCounter'
import Hand from '../reusable/cards/Hand'
import Input from '../reusable/forms/Input'

const HomePage: React.FC<{
  activePlayerHandIndex: number
  basicStrategyError: string
  basicStrategyStreak: number
  cardCounterOpen: boolean
  closeBasicStrategy: () => void
  closeCardCounter: () => void
  count: number | null
  countGuess: number | null
  countOptions: CountOption[]
  dealerCards: Card[]
  enteredBet: number | null
  isBasicStrategyOpen: boolean
  isPlayerTurn: boolean
  numDecks: number
  numRemainingCards: number
  onChangeBet: (value: string) => void
  onClickDeal: () => void
  onCountGuess: (countGuess: number) => void
  onDouble: () => void
  onHit: () => void
  onSplit: () => void
  onStand: () => void
  playerBalance: number
  playerHands: HandInterface[]
  playerHasPlacedFirstBet: boolean
}> = ({
  activePlayerHandIndex,
  basicStrategyError,
  basicStrategyStreak,
  cardCounterOpen,
  closeBasicStrategy,
  closeCardCounter,
  count,
  countGuess,
  countOptions,
  dealerCards,
  enteredBet,
  isBasicStrategyOpen,
  isPlayerTurn,
  numDecks,
  numRemainingCards,
  onChangeBet,
  onClickDeal,
  onCountGuess,
  onDouble,
  onHit,
  onSplit,
  onStand,
  playerBalance,
  playerHands,
  playerHasPlacedFirstBet,
}) => {
  const activeCards = playerHands[activePlayerHandIndex].cards

  return (
    <div className="max-w-screen-md mx-auto px-4 pb-12">
      {playerHasPlacedFirstBet && (
        <div className="flex items-center text-dark-grey text-xs uppercase">
          <span>
            {numDecks} deck{numDecks > 1 ? 's' : ''}
          </span>
          <div className="w-1 h-1 mx-2 rounded-full bg-dark-grey" />
          <span>Remaining cards: {numRemainingCards}</span>
        </div>
      )}

      <div className="relative mt-8">
        <div className="mb-6">
          <Hand
            cards={dealerCards}
            isDealer={true}
            playerActionsEnabled={isPlayerTurn}
          />
        </div>
        {playerHands.map((hand, i) => {
          return (
            <div key={i} className="mb-6">
              <Hand
                bet={hand.bet}
                cards={hand.cards}
                playerActionsEnabled={isPlayerTurn}
                result={hand.result}
                showActiveHandIndicator={
                  isPlayerTurn &&
                  playerHands.length > 1 &&
                  i === activePlayerHandIndex
                }
              />
            </div>
          )
        })}

        {!playerHasPlacedFirstBet && (
          <div className="flex absolute inset-0 items-center justify-center w-full h-full text-light-grey text-lg font-bold italic">
            Set your bet and click deal...
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-8 text-lg">
        {isPlayerTurn && (
          <>
            <Button isInverse={true} onClick={onHit} type="button">
              Hit
            </Button>
            <Button isInverse={true} onClick={onStand} type="button">
              Stand
            </Button>
            <Button
              isDisabled={
                !canDouble({
                  balance: playerBalance,
                  bet: enteredBet || 0,
                  cards: activeCards,
                })
              }
              isInverse={true}
              onClick={onDouble}
              type="button"
            >
              Double
            </Button>
            <Button
              isDisabled={
                !canSplit({
                  balance: playerBalance,
                  bet: enteredBet || 0,
                  cards: activeCards,
                })
              }
              isInverse={true}
              onClick={onSplit}
              type="button"
            >
              Split
            </Button>
          </>
        )}
        {!isPlayerTurn && (
          <>
            <div className="h-12">
              <Input
                onChange={onChangeBet}
                placeholder="Enter bet..."
                type="number"
                value={enteredBet || ''}
              />
            </div>
            <div className="h-12">
              <Button onClick={onClickDeal} type="button">
                Deal
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
        <BasicStrategy
          basicStrategyError={basicStrategyError}
          basicStrategyOpen={isBasicStrategyOpen}
          basicStrategyStreak={basicStrategyStreak}
          closeBasicStrategy={closeBasicStrategy}
        />

        <CardCounter
          cardCounterOpen={cardCounterOpen}
          closeCardCounter={closeCardCounter}
          count={count}
          countGuess={countGuess}
          countOptions={countOptions}
          onCountGuess={onCountGuess}
        />
      </div>
    </div>
  )
}

export default HomePage
