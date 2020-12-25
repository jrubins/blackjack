import { useEffect } from 'react'

import {
  ANALYTICS_SCRIPT_URL,
  initAndSendPageview,
  setupGaTracker,
} from '../utils/analytics'
import { FB_SDK_URL, setupFb } from '../utils/fb'
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

export function useFacebookSDK() {
  useEffect(() => {
    setupFb()

    insertScript({
      id: 'facebook-jssdk',
      src: FB_SDK_URL,
    })
  }, [])
}
