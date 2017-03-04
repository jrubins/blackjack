import React, { PropTypes } from 'react';

import { sumCards } from '../../../utils/cards';

import Card from './card';
import ChevronLeft from '../icons/chevronLeft';

const Hand = ({
  cards,
  isDealer,
  playerActionsEnabled,
  showActiveHandIndicator,
}) => {
  const cardTotal = sumCards(cards);

  return (
    <div className="hand-container">
      <div className="hand-cards">
        {cards.map((card, i) => (
          <div
            key={i}
            className="hand-card"
            style={{
              left: 20 * i,
            }}
          >
            <Card
              card={card}
              cardCovered={isDealer && playerActionsEnabled && i === 1}
            />
          </div>
        ))}

        {showActiveHandIndicator &&
          <div
            className="active-hand-indicator"
            style={{
              // 80px is the width of a single card.
              left: 80 + (cards.length * 20),
            }}
          >
            <ChevronLeft />
            <ChevronLeft />
            <ChevronLeft />
          </div>
        }
      </div>
      {cards.length > 0 && (!isDealer || !playerActionsEnabled) &&
        <div className="card-total">
          {cardTotal.low !== cardTotal.high
            ? `${cardTotal.low}/${cardTotal.high}`
            : cardTotal.low
          }
        </div>
      }
    </div>
  );
};

Hand.propTypes = {
  cards: PropTypes.array.isRequired,
  isDealer: PropTypes.bool,
  playerActionsEnabled: PropTypes.bool.isRequired,
  showActiveHandIndicator: PropTypes.bool,
};

Hand.defaultProps = {
  isDealer: false,
  showActiveHandIndicator: false,
};

export default Hand;
