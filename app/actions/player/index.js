import {
  PLAYER_LOST,
  PLAYER_WON,
  SET_BET,
} from '../';

export function playerLost() {
  return {
    type: PLAYER_LOST,
  };
}

export function playerWon(amount) {
  return {
    type: PLAYER_WON,
    amount,
  };
}

export function setBet(amount) {
  return {
    type: SET_BET,
    amount,
  };
}
