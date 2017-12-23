/**
 * The tracker name for the global GA object for pushing events.
 *
 * @type {String}
 */
const GA_TRACKER_NAME = 'ga'

/**
 * The GA script URL.
 *
 * @type {String}
 */
export const ANALYTICS_SCRIPT_URL = '//www.google-analytics.com/analytics.js'


export const EVENT_NAMES = {
  // Basic strategy.
  BASIC_STRATEGY_ON: {
    eventCategory: 'Basic Strategy',
    eventAction: 'Widget - On',
  },
  BASIC_STRATEGY_OFF: {
    eventCategory: 'Basic Strategy',
    eventAction: 'Widget - Off',
  },

  // UI Elements.
  MOBILE_NAV_OPEN: {
    eventCategory: 'UI',
    eventAction: 'Mobile Nav - Open',
  },
  MOBILE_NAV_CLOSE: {
    eventCategory: 'UI',
    eventAction: 'Mobile Nav - Close',
  },

  // Betting.
  SET_BET(amount) {
    return {
      eventCategory: 'Bets',
      eventAction: 'Bet - Set',
      eventLabel: amount,
    }
  },

  // Sharing.
  SHARE_FACEBOOK: {
    eventCategory: 'Share',
    eventAction: 'Share - Facebook',
  },
}

/**
 * Sets up the global GA tracker object for pushing events onto.
 */
export function setupGaTracker() {
  window.GoogleAnalyticsObject = GA_TRACKER_NAME
  window[GA_TRACKER_NAME] = window[GA_TRACKER_NAME] || function(...args) {
    (window[GA_TRACKER_NAME].q = window[GA_TRACKER_NAME].q || []).push(args)
  }
  window[GA_TRACKER_NAME].l = 1 * new Date()
}

/**
 * Inits the tracker ID and sends a pageview event.
 */
export function initAndSendPageview() {
  window[GA_TRACKER_NAME]('create', process.env.GA_PROPERTY, 'auto')
  window[GA_TRACKER_NAME]('send', 'pageview')
}

/**
 * Sends a custom event.
 *
 * @param {Object} opts
 */
export function customEvent(...opts) {
  window[GA_TRACKER_NAME]('send', 'event', ...opts)
}
