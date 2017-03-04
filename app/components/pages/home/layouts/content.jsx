import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  EVENT_NAMES,
  customEvent,
} from '../../../../utils/analytics';
import { PLAYER_DECISIONS } from '../../../../utils/constants';
import {
  dealCard,
  makeDeck,
  sumCards,
} from '../../../../utils/cards';
import {
  checkBasicStrategy,
} from '../../../../utils/strategy';

import {
  getPlayerBalance,
} from '../../../../reducers';
import {
  deductBalance,
  playerLost,
  playerWon,
} from '../../../../actions/player';

import BasicStrategyAdvice from '../../../reusable/advice/basicStrategy';
import Button from '../../../reusable/forms/button';
import Hand from '../../../reusable/cards/hand';
import Input from '../../../reusable/forms/input';

class HomeContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlayerHandIndex: 0,
      basicStrategyError: null,
      basicStrategyStreak: 0,
      dealerCards: [],
      enteredBet: null,
      playerDecision: false,
      playerHands: [
        {
          // Need this field since the bet may change during the round (double, split, etc.).
          bet: null,
          cards: [],
        },
      ],
      playerHasPlacedFirstBet: false,
      roundOver: true,
    };

    this.deal = this.deal.bind(this);
    this.handleBetChange = this.handleBetChange.bind(this);
    this.handlePlayerAction = this.handlePlayerAction.bind(this);
  }

  componentDidMount() {
    // Make our deck of cards.
    makeDeck(1);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      dealerCards,
      enteredBet,
      playerDecision,
      playerHands,
      roundOver,
    } = this.state;
    const {
      roundOver: prevRoundOver,
    } = prevState;

    if (roundOver) {
      if (roundOver !== prevRoundOver) {
        // Make sure the automatic bet is adjusted properly with the player's new balance.
        this.handleBetChange(enteredBet);
      }

      return;
    }

    const activePlayerHand = this.getActivePlayerHand();
    console.log('active hand:', activePlayerHand);

    // Nothing to check if the player doesn't yet have a hand.
    if (!activePlayerHand) {
      return;
    }

    // The active hand could have less than two cards if we're moving on to the second hand
    // after a split.
    if (activePlayerHand.cards.length < 2) {
      this.setState(prevState => ({
        playerHands: this.getNewCardPlayerHandState(prevState, dealCard()),
      }));
    }

    const dealerTotal = sumCards(dealerCards).high;
    const playerTotal = sumCards(activePlayerHand.cards).high;
    console.log('playerTotal:', playerTotal);

    if (playerDecision) {
      // If either the dealer or player got 21, it's no longer the player's decision.
      if (dealerTotal === 21) {
        this.setState({
          playerDecision: false,
        });
      } else if (playerTotal === 21) { // They may have split and gotten 21, so they may not be definitively done.
        this.playerDoneWithCurrentHand();
      } else if (playerTotal > 21) { // Check if the player bust in all their hands.
        if (this.playerBustedOnAllHands()) {
          this.roundOver();
        } else {
          this.playerDoneWithCurrentHand();
        }
      }
    } else { // Not the player's decision.
      // Check if we need to keep adding cards to the dealer's hand.
      if (dealerTotal < 17) {
        this.addCardToHand(true);
      } else { // Dealer is done hitting.
        let playerWinnings = 0;
        playerHands.forEach(({ bet, cards }) => {
          const handTotal = sumCards(cards).high;

          // Check to see if player got blackjack.
          if (handTotal === 21 && cards.length === 2) {
            playerWinnings += Math.round(bet + (bet * 3 / 2));
          } else if ((handTotal <= 21 && handTotal > dealerTotal) || dealerTotal > 21) { // Straight win or dealer bust.
            playerWinnings += bet * 2;
          } else if (handTotal === dealerTotal) { // A push.
            playerWinnings += bet;
          }

          console.log('playerWinnings:', playerWinnings, bet);
        });

        this.roundOver(playerWinnings);
      }
    }
  }

  /**
   * Indicates the round has ended with the player either winning or losing.
   *
   * @param {Number} [playerWinnings]
   */
  roundOver(playerWinnings = null) {
    const {
      playerLost,
      playerWon,
    } = this.props;

    if (playerWinnings) {
      playerWon(playerWinnings);
    } else {
      playerLost();
    }

    this.setState({
      playerDecision: false,
      roundOver: true,
    });
  }

  /**
   * Adds a new card to the dealer's or player's hand.
   *
   * @param {Boolean} [isDealer]
   */
  addCardToHand(isDealer = false) {
    const newCard = dealCard();

    this.setState(prevState => {
      if (isDealer) {
        const dealerCards = prevState.dealerCards;

        return {
          dealerCards: [
            ...dealerCards,
            newCard,
          ],
        };
      }

      return {
        playerHands: this.getNewCardPlayerHandState(prevState, newCard),
      };
    });
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
    } = state;
    const newPlayerHands = [...playerHands];
    const activePlayerHandBet = newPlayerHands[activePlayerHandIndex].bet;

    // Add the new card to the active player hand.
    newPlayerHands[activePlayerHandIndex] = {
      bet: isDouble ? activePlayerHandBet * 2 : activePlayerHandBet,
      cards: [
        ...newPlayerHands[activePlayerHandIndex].cards,
        newCard,
      ],
    };

    return newPlayerHands;
  }

  /**
   * Handles a bet change by the user.
   *
   * @param {String} value
   */
  handleBetChange(value) {
    const {
      playerBalance,
    } = this.props;

    // Parse whatever they entered into a number.
    const parsedBet = Number.parseInt(value, 10);

    // If the value couldn't be parsed, don't use it.
    let resolvedBet = Number.isNaN(parsedBet) ? null : parsedBet;

    // Don't let the bet be less than zero.
    resolvedBet = Math.max(resolvedBet, 0);

    // Don't let the bet be more than the player's remaining balance.
    resolvedBet = Math.min(resolvedBet, playerBalance);

    this.setState({
      enteredBet: resolvedBet ? resolvedBet : null,
    });
  }

  /**
   * Starts a new round by dealing cards.
   */
  deal() {
    const {
      deductBalance,
    } = this.props;
    const {
      enteredBet,
    } = this.state;

    // Can't deal if the player hasn't entered a bet yet.
    if (!enteredBet) {
      return;
    }

    // Order here to mimic an actual deal at a casino.
    const player1 = dealCard();
    const dealer1 = dealCard();
    const player2 = dealCard();
    const dealer2 = dealCard();

    deductBalance(enteredBet);

    customEvent(EVENT_NAMES.SET_BET(enteredBet));

    this.setState({
      activePlayerHandIndex: 0,
      basicStrategyError: null,
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
        },
      ],
      playerHasPlacedFirstBet: true,
      roundOver: false,
    });
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
    } = this.props;
    const {
      dealerCards,
      enteredBet,
    } = this.state;
    const activePlayerHand = this.getActivePlayerHand();
    const basicStrategyResult = checkBasicStrategy({
      playerCards: activePlayerHand.cards,
      dealerUpCardValue: dealerCards[0].number,
      playerAction: action,
      hasEnoughToDouble: playerBalance >= enteredBet,
    });

    if (basicStrategyResult) {
      this.setState(prevState => ({
        basicStrategyStreak: basicStrategyResult.correct ? prevState.basicStrategyStreak + 1 : 0,
        basicStrategyError: basicStrategyResult.correct ? null : basicStrategyResult.error,
      }));
    }

    if (action === PLAYER_DECISIONS.HIT) {
      this.addCardToHand();
    } else if (action === PLAYER_DECISIONS.STAND) {
      this.playerDoneWithCurrentHand();
    } else if (action === PLAYER_DECISIONS.DOUBLE) {
      deductBalance(enteredBet);

      this.setState(prevState => ({
        playerHands: this.getNewCardPlayerHandState(prevState, dealCard(), true),
      }));

      // Once you double, you're done with deciding anything else.
      this.playerDoneWithCurrentHand();
    } else if (action === PLAYER_DECISIONS.SPLIT) {
      deductBalance(enteredBet);

      this.setState(() => ({
        playerHands: [
          {
            bet: activePlayerHand.bet,
            cards: [
              activePlayerHand.cards[0],
              dealCard(),
            ],
          },
          {
            bet: activePlayerHand.bet,
            cards: [
              activePlayerHand.cards[1],
            ],
          },
        ],
      }));
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
    } = this.state;

    return playerHands[activePlayerHandIndex];
  }

  /**
   * Indicates the player is done with their current hand and the state should be updated accordingly.
   */
  playerDoneWithCurrentHand() {
    this.setState(prevState => {
      const {
        activePlayerHandIndex,
        playerHands,
      } = prevState;
      const playerHasMoreHands = activePlayerHandIndex !== playerHands.length - 1;

      return {
        activePlayerHandIndex: playerHasMoreHands ? prevState.activePlayerHandIndex + 1 : prevState.activePlayerHandIndex,
        playerDecision: playerHasMoreHands,
      };
    });
  }

  /**
   * Returns if the player has busted in all their hands.
   *
   * @returns {Boolean}
   */
  playerBustedOnAllHands() {
    const {
      playerHands,
    } = this.state;

    return _.every(playerHands, playerHand => sumCards(playerHand.cards).low > 21);
  }

  render() {
    const {
      playerBalance,
    } = this.props;
    const {
      basicStrategyError,
      basicStrategyStreak,
      dealerCards,
      enteredBet,
      playerDecision,
      playerHands,
      playerHasPlacedFirstBet,
    } = this.state;
    const activePlayerHand = this.getActivePlayerHand();
    const canSplitActiveHand = (
      activePlayerHand.cards.length === 2 &&
      activePlayerHand.cards[0].number === activePlayerHand.cards[1].number
    );
    console.log('active player hand:', activePlayerHand);

    return (
      <div className="home-content-container">
        <div className="hands">
          <Hand
            cards={dealerCards}
            isDealer={true}
            playerActionsEnabled={playerDecision}
          />
          {playerHands.map((hand, i) => (
            <Hand
              key={i}
              cards={hand.cards}
              playerActionsEnabled={playerDecision}
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
              isDisabled={activePlayerHand.cards.length > 2 || playerBalance < enteredBet}
            />
            <Button
              text="Split"
              handleClick={() => this.handlePlayerAction(PLAYER_DECISIONS.SPLIT)}
              inverse={true}
              isDisabled={!canSplitActiveHand}
            />
          </div>
        }

        <BasicStrategyAdvice
          basicStrategyError={basicStrategyError}
          basicStrategyStreak={basicStrategyStreak}
        />
      </div>
    );
  }
}

HomeContent.propTypes = {
  deductBalance: PropTypes.func.isRequired,
  playerBalance: PropTypes.number.isRequired,
  playerLost: PropTypes.func.isRequired,
  playerWon: PropTypes.func.isRequired,
};

export default connect(state => ({
  playerBalance: getPlayerBalance(state),
}), {
  deductBalance,
  playerLost,
  playerWon,
})(HomeContent);
