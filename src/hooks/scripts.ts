import { useEffect } from 'react'

import {
  ANALYTICS_SCRIPT_URL,
  initAndSendPageview,
  setupGaTracker,
} from '../utils/analytics'
import { insertScript } from '../utils/dom'

export function useGoogleAnalytics() {
  useEffect(() => {
    setupGaTracker()

    initAndSendPageview()

    insertScript({
      id: 'ga-js',
      src: ANALYTICS_SCRIPT_URL,
    })
  }, [])
}
