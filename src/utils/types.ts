export interface Card {
  number: number
  suit: SUITS
}

export interface CountOption {
  label: string
  value: number
}

export interface GenericObject {
  [fieldName: string]: any
}

export enum HAND_RESULTS {
  LOST = 'lost',
  PUSH = 'push',
  WON = 'won',
}

export interface Hand {
  // Need this field since the bet may change during the round (double, split, etc.).
  bet: number | null
  cards: Card[]
  result: HAND_RESULTS | null
}

export enum PLAYER_DECISIONS {
  DOUBLE = 'double',
  HIT = 'hit',
  SPLIT = 'split',
  STAND = 'stand',
}

export interface Strategy {
  action: PLAYER_DECISIONS
  noDoubleAction?: PLAYER_DECISIONS
  player: number[]
  error: string
  exceptions?: {
    action: PLAYER_DECISIONS
    dealer: number[]
    noDoubleAction?: PLAYER_DECISIONS
  }[]
}

export enum SUITS {
  CLUBS = 'clubs',
  DIAMONDS = 'diamonds',
  HEARTS = 'hearts',
  SPADES = 'spades',
}

export type ThemeColor = '#42b4e6' | '#6a0caf'
