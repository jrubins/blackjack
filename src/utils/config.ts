const LOCALSTORAGE_KEY = 'blackjack'

export interface BlackjackConfig {
  balance: number
  isBasicStrategyOpen: boolean
  isCardCounterOpen: boolean
  numDecks: number
}

function getBlackjackConfig(): BlackjackConfig {
  return JSON.parse(
    window.localStorage.getItem(LOCALSTORAGE_KEY) || '{}'
  ) as BlackjackConfig
}

export function getConfigValue<T extends keyof BlackjackConfig>(
  itemName: T,
  defaultValue: BlackjackConfig[T]
): BlackjackConfig[T] {
  try {
    return getBlackjackConfig()[itemName] ?? defaultValue
  } catch (err) {
    console.info(`Failed to access "${itemName}" from local storage.`)
  }

  return defaultValue
}

export function setConfigValue<T extends keyof BlackjackConfig>(
  itemName: T,
  value: BlackjackConfig[T]
): void {
  try {
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({
        ...getBlackjackConfig(),
        [itemName]: value,
      })
    )
  } catch (err) {
    console.info(`Failed to set "${itemName}" into local storage.`)
  }
}
