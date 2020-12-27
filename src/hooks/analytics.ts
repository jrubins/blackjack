import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

import { error } from '../utils/logs'
import { GenericObject } from '../utils/types'
import { insertScript } from '../utils/dom'

export enum EVENT_NAMES {
  // Basic Strategy
  BASIC_STRATEGY_ON = 'Basic Strategy On',
  BASIC_STRATEGY_OFF = 'Basic Strategy Off',

  // UI Elements
  MOBILE_NAV_OPEN = 'Mobile Nav Open',
  MOBILE_NAV_CLOSE = 'Mobile Nav Close',

  // Betting
  SET_BET = 'Set Bet',
}

const EVENT_CATEGORIES = {
  'Basic Strategy': [
    EVENT_NAMES.BASIC_STRATEGY_ON,
    EVENT_NAMES.BASIC_STRATEGY_OFF,
  ],
  Bets: [EVENT_NAMES.SET_BET],
  UI: [EVENT_NAMES.MOBILE_NAV_OPEN, EVENT_NAMES.MOBILE_NAV_CLOSE],
}

type EventOpts<T extends EVENT_NAMES> = T extends EVENT_NAMES.SET_BET
  ? { label: number }
  : undefined

function checkInit(fnName: string) {
  if (!window.analytics) {
    throw new Error(`${fnName} must be called after useSegmentScript.`)
  }
}

/**
 * Tracks a custom event.
 */
export function track<T extends EVENT_NAMES>(name: T, opts?: EventOpts<T>) {
  checkInit('track')

  const eventCategory = _.findKey(EVENT_CATEGORIES, (eventNames) =>
    eventNames.includes(name)
  )
  let eventOpts: GenericObject | undefined = opts
  if (eventCategory) {
    eventOpts = { ...(opts || {}), category: eventCategory }
  }

  window.analytics.track(name, eventOpts)
}

/**
 * Initialized the Segment analytics library.
 */
export function useSegmentTracking() {
  useEffect(() => {
    window.analytics = window.analytics || []
    const customAnalytics = window.analytics as any

    if (!customAnalytics.initialize) {
      if (customAnalytics.invoked) {
        error('Segment snippet included twice.')
      } else {
        customAnalytics.invoked = true
        customAnalytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
          'addSourceMiddleware',
          'addIntegrationMiddleware',
          'setAnonymousId',
          'addDestinationMiddleware',
        ]
        customAnalytics.factory = function (t) {
          return function () {
            /* eslint-disable */
            const e = Array.prototype.slice.call(arguments)
            /* eslint-enable */
            e.unshift(t)
            customAnalytics.push(e)
            return customAnalytics
          }
        }
        for (let t = 0; t < customAnalytics.methods.length; t++) {
          const e = customAnalytics.methods[t]
          customAnalytics[e] = customAnalytics.factory(e)
        }
        customAnalytics.SNIPPET_VERSION = '4.13.1'
      }
    }

    insertScript({
      async: true,
      id: 'segment-js-sdk',
      src: `https://cdn.segment.com/analytics.js/v1/${process.env.SEGMENT_KEY}/analytics.min.js`,
    })
  }, [])

  const location = useLocation()
  useEffect(() => {
    window.analytics.page()
  }, [location.pathname])
}
