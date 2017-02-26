import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  dealCard,
  makeDeck,
  sumCards,
} from '../../../../utils/cards';

import { getPlayerBalance } from '../../../../reducers';
import {
  playerLost,
  playerWon,
  setBet,
} from '../../../../actions/player';

import Button from '../../../reusable/forms/button';
import Hand from '../../../reusable/cards/hand';
import Input from '../../../reusable/forms/input';

class HomeContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dealerCards: [],
      playerBet: null,
      playerCards: [],
      playerDecision: true,
      roundOver: false,
    };

    this.deal = this.deal.bind(this);
    this.handleBetChange = this.handleBetChange.bind(this);
    this.handlePlayerAction = this.handlePlayerAction.bind(this);
  }

  componentDidMount() {
    makeDeck(1);
  }

  componentDidUpdate() {
    const {
      playerLost,
      playerWon,
    } = this.props;
    const {
      dealerCards,
      playerBet,
      playerCards,
      playerDecision,
      roundOver,
    } = this.state;
    const dealerTotal = sumCards(dealerCards).high;
    const playerTotal = sumCards(playerCards).high;
    console.log(dealerTotal, playerTotal);

    if (roundOver) {
      return;
    }

    if (playerDecision) {
      if (playerTotal > 21) {
        console.log('player bust');
        this.setState({
          playerDecision: false,
          roundOver: true,
        });

        playerLost();
      }
    } else {
      if (dealerTotal < 17) {
        console.log('dealer hit');
        const newCard = dealCard();

        this.setState(prevState => ({
          dealerCards: [
            ...prevState.dealerCards,
            newCard,
          ],
        }));
      } else if (playerTotal > dealerTotal || dealerTotal > 21) {
        console.log('player won');
        playerWon(playerBet * 2);

        this.setState({
          roundOver: true,
        });
      } else if (playerTotal === dealerTotal) {
        console.log('player push');
        playerWon(playerBet);

        this.setState({
          roundOver: true,
        });
      } else if (playerTotal < dealerTotal) {
        console.log('player lost');
        playerLost();

        this.setState({
          roundOver: true,
        });
      }
    }
  }

  handleBetChange(value) {
    const { playerBalance } = this.props;
    const parsedBet = Number.parseInt(value, 10);
    const resolvedBet = Number.isNaN(parsedBet) ? null : parsedBet;
    console.log(value, parsedBet, resolvedBet, playerBalance);

    this.setState({
      playerBet: resolvedBet ? Math.min(resolvedBet, playerBalance) : null,
    });
  }

  deal() {
    const { setBet } = this.props;
    const { playerBet } = this.state;

    if (!playerBet) {
      return;
    }

    const card1 = dealCard();
    const card2 = dealCard();
    const card3 = dealCard();
    const card4 = dealCard();

    setBet(playerBet);

    this.setState({
      dealerCards: [
        card2,
        card4,
      ],
      playerCards: [
        card1,
        card3,
      ],
      playerDecision: true,
      roundOver: false,
    });
  }

  handlePlayerAction(action) {
    if (action === 'hit') {
      const hitCard = dealCard();

      this.setState(prevState => ({
        playerCards: [
          ...prevState.playerCards,
          hitCard,
        ],
      }));
    } else if (action === 'stand') {
      this.setState({
        playerDecision: false,
      });
    }
  }

  render() {
    const {
      playerBalance,
    } = this.props;
    const {
      dealerCards,
      playerBet,
      playerCards,
      playerDecision,
    } = this.state;

    return (
      <div className="home-content-container">
        <div className="top-actions">
          <div className="player-balance">
            Balance: ${playerBalance}
          </div>

          <div className="player-bet">
            <Input
              handleChange={this.handleBetChange}
              type="number"
              value={playerBet}
            />

            <Button
              handleClick={this.deal}
              text="Deal"
            />
          </div>
        </div>
        <div className="hands">
          <Hand
            cards={dealerCards}
            isDealer={true}
            playerActionsEnabled={playerDecision}
          />
          <Hand
            cards={playerCards}
            handlePlayerAction={this.handlePlayerAction}
            playerActionsEnabled={playerDecision}
          />
        </div>
      </div>
    );
  }
}

HomeContent.propTypes = {
  playerBalance: PropTypes.number.isRequired,
  playerLost: PropTypes.func.isRequired,
  playerWon: PropTypes.func.isRequired,
  setBet: PropTypes.func.isRequired,
};

export default connect(state => ({
  playerBalance: getPlayerBalance(state),
}), {
  playerLost,
  playerWon,
  setBet,
})(HomeContent);
