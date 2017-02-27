import React, { PropTypes } from 'react';
import _ from 'lodash';

import { SUITS } from '../../../utils/cards';

import ClubIcon from '../icons/club';
import DiamondIcon from '../icons/diamond';
import HeartIcon from '../icons/heart';
import SpadeIcon from '../icons/spade';

const Card = ({ card, cardCovered }) => {
  const {
    number,
    suit,
  } = card;
  let cardNumber = number;
  let CardIcon;

  if (cardNumber === 1) {
    cardNumber = 'A';
  } else if (cardNumber === 11) {
    cardNumber = 'J';
  } else if (cardNumber === 12) {
    cardNumber = 'Q';
  } else if (cardNumber === 13) {
    cardNumber = 'K';
  }

  if (suit === SUITS.CLUBS) {
    CardIcon = ClubIcon;
  } else if (suit === SUITS.DIAMONDS) {
    CardIcon = DiamondIcon;
  } else if (suit === SUITS.HEARTS) {
    CardIcon = HeartIcon;
  } else {
    CardIcon = SpadeIcon;
  }

  return (
    <div className="card-container">
      {cardCovered &&
        <div className="card-cover" />
      }

      <div className="card-left-rail">
        <span className="card-number">
          {cardNumber}

          <CardIcon />
        </span>
      </div>
      <div className="card-middle">
        <CardIcon />
      </div>
      <div className="card-right-rail">
        <span className="card-number">
          {cardNumber}

          <CardIcon />
        </span>
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    number: PropTypes.number.isRequired,
    suit: PropTypes.oneOf(_.values(SUITS)).isRequired,
  }).isRequired,
  cardCovered: PropTypes.bool,
};

export default Card;
