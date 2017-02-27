import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

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
      // Need this field since the bet may change during the round (double, split, etc.).
      activeBet: null,
      basicStrategyError: null,
      basicStrategyStreak: 0,
      dealerCards: [],
      enteredBet: null,
      playerCards: [],
      playerDecision: false,
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
      activeBet,
      dealerCards,
      enteredBet,
      playerCards,
      playerDecision,
      roundOver,
    } = this.state;
    const {
      roundOver: prevRoundOver,
    } = prevState;
    const dealerTotal = sumCards(dealerCards).high;
    const playerTotal = sumCards(playerCards).high;

    if (roundOver) {
      if (roundOver !== prevRoundOver) {
        // Make sure the automatic bet is adjusted properly with the player's new balance.
        this.handleBetChange(enteredBet);
      }

      return;
    }

    if (playerTotal > 21) { // Check if the player bust.
      this.roundOver();
    } else if (playerDecision) {
      // If either the dealer or player got 21, it's no longer the player's decision.
      if (dealerTotal === 21 || playerTotal === 21) {
        this.setState({
          playerDecision: false,
        });
      }
    } else if (dealerTotal < 17) {
      this.addCardToHand(true);
    } else if (playerTotal > dealerTotal || dealerTotal > 21) { // Dealer bust or player beat dealer.
      let playerWinnings;

      // Check to see if player got blackjack.
      if (playerTotal === 21 && playerCards.length === 2) {
        playerWinnings = Math.round(activeBet + (activeBet * 3 / 2));
      } else {
        playerWinnings = activeBet * 2;
      }

      this.roundOver(playerWinnings);
    } else if (playerTotal === dealerTotal) { // A push.
      this.roundOver(activeBet);
    } else if (playerTotal < dealerTotal) { // Player lost straight up.
      this.roundOver();
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
      let existingCards = prevState.playerCards;

      if (isDealer) {
        existingCards = prevState.dealerCards;
      }

      return {
        [isDealer ? 'dealerCards' : 'playerCards']: [
          ...existingCards,
          newCard,
        ],
      };
    });
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

    this.setState({
      activeBet: enteredBet,
      dealerCards: [
        dealer1,
        dealer2,
      ],
      playerCards: [
        player1,
        player2,
      ],
      playerDecision: true,
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
    } = this.props;
    const {
      dealerCards,
      enteredBet,
      playerCards,
    } = this.state;
    const basicStrategyResult = checkBasicStrategy(playerCards, dealerCards[0].number, action);

    if (basicStrategyResult) {
      this.setState(prevState => ({
        basicStrategyStreak: basicStrategyResult.correct ? prevState.basicStrategyStreak + 1 : 0,
        basicStrategyError: basicStrategyResult.correct ? null : basicStrategyResult.error,
      }));
    }

    if (action === PLAYER_DECISIONS.HIT) {
      this.addCardToHand();
    } else if (action === PLAYER_DECISIONS.STAND) {
      this.setState({
        playerDecision: false,
      });
    } else if (action === PLAYER_DECISIONS.DOUBLE) {
      deductBalance(enteredBet);

      this.setState(prevState => ({
        activeBet: prevState.enteredBet * 2,
        playerCards: [
          ...prevState.playerCards,
          dealCard(),
        ],
        // Once you double, you're done with deciding anything else.
        playerDecision: false,
      }));
    }
  }

  render() {
    const {
      basicStrategyError,
      basicStrategyStreak,
      dealerCards,
      enteredBet,
      playerCards,
      playerDecision,
      roundOver,
    } = this.state;

    return (
      <div className="home-content-container">
        <div className="hands">
          <Hand
            cards={dealerCards}
            isDealer={true}
            playerActionsEnabled={playerDecision}
          />
          <Hand
            cards={playerCards}
            playerActionsEnabled={playerDecision}
          />

          {playerCards.length === 0 && roundOver &&
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
