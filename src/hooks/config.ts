import { useEffect } from 'react'

import { BlackjackConfig, setConfigValue } from '../utils/config'

export function useConfigSync(blackjackConfig: BlackjackConfig) {
  useEffect(() => {
    setConfigValue('balance', blackjackConfig.balance)
  }, [blackjackConfig.balance])

  useEffect(() => {
    setConfigValue('isBasicStrategyOpen', blackjackConfig.isBasicStrategyOpen)
  }, [blackjackConfig.isBasicStrategyOpen])

  useEffect(() => {
    setConfigValue('isCardCounterOpen', blackjackConfig.isCardCounterOpen)
  }, [blackjackConfig.isCardCounterOpen])

  useEffect(() => {
    setConfigValue('numDecks', blackjackConfig.numDecks)
  }, [blackjackConfig.numDecks])
}
