import React, { PropTypes } from 'react';

import { sumCards } from '../../../utils/cards';

import Card from './card';

const Hand = ({
  cards,
  isDealer,
  playerActionsEnabled,
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
};

Hand.defaultProps = {
  isDealer: false,
};

export default Hand;
