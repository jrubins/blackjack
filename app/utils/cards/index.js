import _ from 'lodash';

export const SUITS = {
  CLUBS: 'clubs',
  DIAMONDS: 'diamonds',
  HEARTS: 'hearts',
  SPADES: 'spades',
};

let deck = [];
let deckIndex = 0;

export function makeDeck(numDecks) {
  const suitKeys = _.values(SUITS);

  for (let i = 0; i < numDecks; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 13; k++) {
        deck.push({
          number: (k + 1),
          suit: suitKeys[j],
        });
      }
    }
  }

  deck = _.shuffle(deck);
  console.log(deck);
}

export function dealCard() {
  return deck[deckIndex++];
}

export function sumCards(cards) {
  const cardTotal = cards.reduce((sum, { number }) => sum + Math.min(number, 10), 0);
  const hasAce = _.find(cards, { number: 1 });

  return {
    low: cardTotal,
    high: hasAce ? (cardTotal + 10 > 21 ? cardTotal : cardTotal + 10) : cardTotal,
  };
}
