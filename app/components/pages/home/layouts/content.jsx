import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  EVENT_NAMES,
  customEvent,
} from '../../../../utils/analytics'
import {
  HAND_RESULTS,
  PLAYER_DECISIONS,
} from '../../../../utils/constants'
import {
  KEYCODES,
} from '../../../../utils/keyboard'
import {
  dealCard,
  getNumCardsRemainingInDeck,
  makeDeck,
  sumCards,
} from '../../../../utils/cards'
import {
  checkBasicStrategy,
} from '../../../../utils/strategy'

import {
  getNumDecks,
  getPlayerBalance,
} from '../../../../reducers'
import {
  cardDealt,
  cardRevealed,
} from '../../../../actions/gameplay'
import {
  deductBalance,
  playerLost,
  playerWon,
} from '../../../../actions/player'

import BasicStrategyAdvice from '../../../reusable/advice/basicStrategy'
import CardCounterAdvice from '../../../reusable/advice/cardCounter'
import Button from '../../../reusable/forms/button'
import Hand from '../../../reusable/cards/hand'
import Input from '../../../reusable/forms/input'

class HomeContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activePlayerHandIndex: 0,
      basicStrategyError: null,
      basicStrategyStreak: 0,
      countGuess: null,
      dealerCards: [],
      enteredBet: null,
      playerDecision: false,
      playerHands: [
        {
          // Need this field since the bet may change during the round (double, split, etc.).
          bet: null,
          cards: [],
          result: null,
        },
      ],
      playerHasPlacedFirstBet: false,
      roundOver: true,
    }

    this.deal = this.deal.bind(this)
    this.handleBetChange = this.handleBetChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handlePlayerAction = this.handlePlayerAction.bind(this)
    this.handleCountGuess = this.handleCountGuess.bind(this)
  }

  componentDidMount() {
    this.createDeck()

    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      cardRevealed,
      numDecks,
    } = this.props
    const {
      numDecks: prevNumDecks,
    } = prevProps
    const {
      dealerCards,
      enteredBet,
      playerDecision,
      roundOver,
    } = this.state
    const {
      playerDecision: prevPlayerDecision,
      roundOver: prevRoundOver,
    } = prevState

    // Create a new deck if they changed the number of decks to use.
    if (numDecks !== prevNumDecks) {
      this.createDeck()
    }

    // If it's no longer the player's decision, the dealer card has been revealed.
    if (!playerDecision && playerDecision !== prevPlayerDecision) {
      cardRevealed(dealerCards[1].number)
    }

    if (roundOver) {
      if (roundOver !== prevRoundOver) {
        // Make sure the automatic bet is adjusted properly with the player's new balance.
        this.handleBetChange(enteredBet)
      }

      return
    }

    const activePlayerHand = this.getActivePlayerHand()

    // Nothing to check if the player doesn't yet have a hand.
    if (!activePlayerHand) {
      return
    }

    // The active hand could have less than two cards if we're moving on to the second hand
    // after a split.
    if (activePlayerHand.cards.length < 2) {
      this.setState(prevState => ({
        countGuess: null,
        playerHands: this.getNewCardPlayerHandState(prevState, this.getNextCard()),
      }))
    }

    const dealerTotal = sumCards(dealerCards).high
    const playerTotal = sumCards(activePlayerHand.cards).high

    if (playerDecision) {
      // If either the dealer or player got 21, it's no longer the player's decision.
      if (dealerTotal === 21) {
        this.setState({
          playerDecision: false,
        })
      } else if (playerTotal === 21) { // They may have split and gotten 21, so they may not be definitively done.
        this.playerDoneWithCurrentHand()
      } else if (playerTotal > 21) { // Check if the player bust in all their hands.
        if (this.playerBustedOnAllHands()) {
          this.roundOver()
        } else {
          this.playerDoneWithCurrentHand()
        }
      }
    } else { // Not the player's decision.
      // Check if we need to keep adding cards to the dealer's hand.
      if (dealerTotal < 17) {
        this.addCardToHand(true)
      } else { // Dealer is done hitting.
        this.roundOver()
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Creates a new deck.
   */
  createDeck() {
    const {
      numDecks,
    } = this.props

    // Make our deck of cards.
    makeDeck(numDecks)
  }

  /**
   * Gets the next card from the deck.
   *
   * @param {Object} opts
   * @param {Boolean} [opts.visible]
   * @returns {Object}
   */
  getNextCard(opts = {}) {
    const {
      cardDealt,
    } = this.props
    const {
      visible = true,
    } = opts
    const newCard = dealCard()

    cardDealt(newCard.number, {
      visible,
    })

    this.setState({
      countGuess: null,
    })

    return newCard
  }

  /**
   * Indicates the round has ended.
   */
  roundOver() {
    const {
      playerLost,
      playerWon,
    } = this.props
    const {
      dealerCards,
      playerHands,
    } = this.state
    const dealerTotal = sumCards(dealerCards).high
    const newPlayerHands = [...playerHands]
    let playerWinnings = 0

    playerHands.forEach(({ bet, cards }, i) => {
      const handTotal = sumCards(cards).high
      let handResult = HAND_RESULTS.LOST

      // Check to see if player got blackjack.
      if (handTotal === 21 && cards.length === 2) {
        playerWinnings += Math.round(bet + (bet * 3 / 2))
        handResult = HAND_RESULTS.WON
      } else if ((handTotal <= 21 && handTotal > dealerTotal) || dealerTotal > 21) { // Straight win or dealer bust.
        playerWinnings += bet * 2
        handResult = HAND_RESULTS.WON
      } else if (handTotal === dealerTotal) { // A push.
        playerWinnings += bet
        handResult = HAND_RESULTS.PUSH
      }

      newPlayerHands[i].result = handResult
    })

    if (playerWinnings) {
      playerWon(playerWinnings)
    } else {
      playerLost()
    }

    this.setState({
      countGuess: null,
      playerDecision: false,
      playerHands: newPlayerHands,
      roundOver: true,
    })
  }

  /**
   * Adds a new card to the dealer's or player's hand.
   *
   * @param {Boolean} [isDealer]
   */
  addCardToHand(isDealer = false) {
    const newCard = this.getNextCard()

    this.setState(prevState => {
      if (isDealer) {
        const dealerCards = prevState.dealerCards

        return {
          dealerCards: [
            ...dealerCards,
            newCard,
          ],
        }
      }

      return {
        playerHands: this.getNewCardPlayerHandState(prevState, newCard),
      }
    })
  }

  /**
   * Returns the state for player hands after adding a new card to the active hand.
   *
   * @param {Object} state
   * @param {Array} state.playerHands
   * @param {Number} state.activePlayerHandIndex
   * @param {Object} newCard
   * @param {Boolean} isDouble
   * @returns {Array}
   */
  getNewCardPlayerHandState(state, newCard, isDouble = false) {
    const {
      playerHands,
      activePlayerHandIndex,
    } = state
    const newPlayerHands = [...playerHands]
    const activePlayerHandBet = newPlayerHands[activePlayerHandIndex].bet

    // Add the new card to the active player hand.
    newPlayerHands[activePlayerHandIndex] = {
      bet: isDouble ? activePlayerHandBet * 2 : activePlayerHandBet,
      cards: [
        ...newPlayerHands[activePlayerHandIndex].cards,
        newCard,
      ],
      result: newPlayerHands[activePlayerHandIndex].result,
    }

    return newPlayerHands
  }

  /**
   * Handles a bet change by the user.
   *
   * @param {String} value
   */
  handleBetChange(value) {
    const {
      playerBalance,
    } = this.props

    // Parse whatever they entered into a number.
    const parsedBet = Number.parseInt(value, 10)

    // If the value couldn't be parsed, don't use it.
    let resolvedBet = Number.isNaN(parsedBet) ? null : parsedBet

    // Don't let the bet be less than zero.
    resolvedBet = Math.max(resolvedBet, 0)

    // Don't let the bet be more than the player's remaining balance.
    resolvedBet = Math.min(resolvedBet, playerBalance)

    this.setState({
      enteredBet: resolvedBet ? resolvedBet : null,
    })
  }

  /**
   * Starts a new round by dealing cards.
   */
  deal() {
    const {
      deductBalance,
    } = this.props
    const {
      enteredBet,
    } = this.state

    // Can't deal if the player hasn't entered a bet yet.
    if (!enteredBet) {
      return
    }

    // Order here to mimic an actual deal at a casino.
    const player1 = this.getNextCard()
    const dealer1 = this.getNextCard()
    const player2 = this.getNextCard()
    const dealer2 = this.getNextCard({
      visible: false,
    })

    deductBalance(enteredBet)

    customEvent(EVENT_NAMES.SET_BET(enteredBet))

    this.setState({
      activePlayerHandIndex: 0,
      basicStrategyError: null,
      countGuess: null,
      dealerCards: [
        dealer1,
        dealer2,
      ],
      playerDecision: true,
      playerHands: [
        {
          bet: enteredBet,
          cards: [
            player1,
            player2,
          ],
          result: null,
        },
      ],
      playerHasPlacedFirstBet: true,
      roundOver: false,
    })
  }

  /**
   * Handles an action from a player.
   *
   * @param {String} action
   */
  handlePlayerAction(action) {
    const {
      deductBalance,
      playerBalance,
    } = this.props
    const {
      activePlayerHandIndex,
      dealerCards,
      enteredBet,
    } = this.state
    const activePlayerHand = this.getActivePlayerHand()
    let userHadValidAction = false

    if (action === PLAYER_DECISIONS.HIT) {
      userHadValidAction = true
      this.addCardToHand()
    } else if (action === PLAYER_DECISIONS.STAND) {
      userHadValidAction = true
      this.playerDoneWithCurrentHand()
    } else if (action === PLAYER_DECISIONS.DOUBLE && this.canDoubleActiveHand()) {
      userHadValidAction = true

      deductBalance(enteredBet)

      this.setState(prevState => ({
        countGuess: null,
        playerHands: this.getNewCardPlayerHandState(prevState, this.getNextCard(), true),
      }))

      // Once you double, you're done with deciding anything else.
      this.playerDoneWithCurrentHand()
    } else if (action === PLAYER_DECISIONS.SPLIT && this.canSplitActiveHand()) {
      userHadValidAction = true

      deductBalance(enteredBet)

      this.setState(prevState => {
        const newPlayerHands = [...prevState.playerHands]

        // Remove the current active hand and insert the split hands in its place.
        newPlayerHands.splice(activePlayerHandIndex, 1, {
          bet: enteredBet,
          cards: [
            activePlayerHand.cards[0],
            this.getNextCard(),
          ],
          result: activePlayerHand.result,
        }, {
          bet: enteredBet,
          cards: [
            activePlayerHand.cards[1],
          ],
          result: activePlayerHand.result,
        })

        return {
          countGuess: null,
          playerHands: newPlayerHands,
        }
      })
    }

    if (userHadValidAction) {
      const basicStrategyResult = checkBasicStrategy({
        playerCards: activePlayerHand.cards,
        dealerUpCardValue: dealerCards[0].number,
        playerAction: action,
        hasEnoughToDouble: playerBalance >= enteredBet,
        hasEnoughToSplit: playerBalance >= enteredBet,
      })

      if (basicStrategyResult) {
        this.setState(prevState => ({
          basicStrategyStreak: basicStrategyResult.correct ? prevState.basicStrategyStreak + 1 : 0,
          basicStrategyError: basicStrategyResult.correct ? null : basicStrategyResult.error,
        }))
      }
    }
  }

  /**
   * Returns the active player hand. The player may have more than one hand if they've
   * split their cards.
   *
   * @returns {Array}
   */
  getActivePlayerHand() {
    const {
      activePlayerHandIndex,
      playerHands,
    } = this.state

    return playerHands[activePlayerHandIndex]
  }

  /**
   * Indicates the player is done with their current hand and the state should be updated accordingly.
   */
  playerDoneWithCurrentHand() {
    this.setState(prevState => {
      const {
        activePlayerHandIndex,
        playerHands,
      } = prevState
      const playerHasMoreHands = activePlayerHandIndex !== playerHands.length - 1

      return {
        activePlayerHandIndex: playerHasMoreHands ? prevState.activePlayerHandIndex + 1 : prevState.activePlayerHandIndex,
        playerDecision: playerHasMoreHands,
      }
    })
  }

  /**
   * Returns if the player has busted in all their hands.
   *
   * @returns {Boolean}
   */
  playerBustedOnAllHands() {
    const {
      playerHands,
    } = this.state

    return _.every(playerHands, playerHand => sumCards(playerHand.cards).low > 21)
  }

  /**
   * Handles when the user guesses the count.
   *
   * @param {Boolean} countGuess
   */
  handleCountGuess(countGuess) {
    this.setState({
      countGuess,
    })
  }

  /**
   * Handles a key down event. Use this for convenience of making a decision without clicking on buttons.
   *
   * @param {SyntheticEvent} event
   */
  handleKeyDown(event) {
    const {
      playerDecision,
    } = this.state
    const {
      keyCode,
    } = event

    if (playerDecision) {
      if (keyCode === KEYCODES.D) {
        this.handlePlayerAction(PLAYER_DECISIONS.DOUBLE)
      } else if (keyCode === KEYCODES.H) {
        this.handlePlayerAction(PLAYER_DECISIONS.HIT)
      } else if (keyCode === KEYCODES.S) {
        this.handlePlayerAction(PLAYER_DECISIONS.STAND)
      } else if (keyCode === KEYCODES.P) {
        this.handlePlayerAction(PLAYER_DECISIONS.SPLIT)
      }
    } else {
      if (keyCode === KEYCODES.D || keyCode === KEYCODES.ENTER) {
        this.deal()
      }
    }
  }

  /**
   * Returns if the user can double the active hand.
   *
   * @returns {Boolean}
   */
  canDoubleActiveHand() {
    const {
      playerBalance,
    } = this.props
    const {
      enteredBet,
    } = this.state
    const activePlayerHand = this.getActivePlayerHand()

    return activePlayerHand.cards.length === 2 && playerBalance >= enteredBet
  }

  /**
   * Returns if the user can split the active hand.
   *
   * @returns {Boolean}
   */
  canSplitActiveHand() {
    const {
      playerBalance,
    } = this.props
    const {
      enteredBet,
    } = this.state
    const activePlayerHand = this.getActivePlayerHand()

    return (
      activePlayerHand.cards.length === 2 &&
      activePlayerHand.cards[0].number === activePlayerHand.cards[1].number &&
      playerBalance >= enteredBet
    )
  }

  render() {
    const {
      numDecks,
    } = this.props
    const {
      activePlayerHandIndex,
      basicStrategyError,
      basicStrategyStreak,
      countGuess,
      dealerCards,
      enteredBet,
      playerDecision,
      playerHands,
      playerHasPlacedFirstBet,
    } = this.state
    const canDoubleActiveHand = this.canDoubleActiveHand()
    const canSplitActiveHand = this.canSplitActiveHand()

    return (
      <div className="home-content-container">
        {playerHasPlacedFirstBet &&
          <div className="deck-details">
            <span>{numDecks} deck{numDecks > 1 ? 's' : ''}</span>
            <span className="bullet" />
            <span>Remaining cards: {getNumCardsRemainingInDeck()}</span>
          </div>
        }

        <div className="hands">
          <Hand
            hand={{
              cards: dealerCards,
            }}
            isDealer={true}
            playerActionsEnabled={playerDecision}
          />
          {playerHands.map((hand, i) => (
            <Hand
              key={i}
              hand={hand}
              playerActionsEnabled={playerDecision}
              showActiveHandIndicator={playerDecision && playerHands.length > 1 && i === activePlayerHandIndex}
            />
          ))}

          {!playerHasPlacedFirstBet &&
            <div className="hands-waiting">
              Set your bet and click deal...
            </div>
          }
        </div>

        {!playerDecision &&
          <div className="player-actions">
            <Input
              handleChange={this.handleBetChange}
              placeholder="Enter bet..."
              type="number"
              value={enteredBet}
            />

            <Button
              handleClick={this.deal}
              text="Deal"
            />
          </div>
        }

        {playerDecision &&
          <div className="player-actions">
            <Button
              text="Hit"
              handleClick={() => this.handlePlayerAction(PLAYER_DECISIONS.HIT)}
              inverse={true}
            />
            <Button
              text="Stand"
              handleClick={() => this.handlePlayerAction(PLAYER_DECISIONS.STAND)}
              inverse={true}
            />
            <Button
              text="Double"
              handleClick={() => this.handlePlayerAction(PLAYER_DECISIONS.DOUBLE)}
              inverse={true}
              isDisabled={!canDoubleActiveHand}
            />
            <Button
              text="Split"
              handleClick={() => this.handlePlayerAction(PLAYER_DECISIONS.SPLIT)}
              inverse={true}
              isDisabled={!canSplitActiveHand}
            />
          </div>
        }

        <div className="advice">
          <BasicStrategyAdvice
            basicStrategyError={basicStrategyError}
            basicStrategyStreak={basicStrategyStreak}
          />

          <CardCounterAdvice
            countGuess={countGuess}
            handleCountGuess={this.handleCountGuess}
          />
        </div>
      </div>
    )
  }
}

HomeContent.propTypes = {
  cardDealt: PropTypes.func.isRequired,
  cardRevealed: PropTypes.func.isRequired,
  deductBalance: PropTypes.func.isRequired,
  numDecks: PropTypes.number.isRequired,
  playerBalance: PropTypes.number.isRequired,
  playerLost: PropTypes.func.isRequired,
  playerWon: PropTypes.func.isRequired,
}

export default connect(state => ({
  numDecks: getNumDecks(state),
  playerBalance: getPlayerBalance(state),
}), {
  cardDealt,
  cardRevealed,
  deductBalance,
  playerLost,
  playerWon,
})(HomeContent)
